import ExpoModulesCore
import GoogleSignIn
import UIKit

public class GoogleAuthModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GoogleAuth")

    Events("onSignInResult")

    AsyncFunction("signInAsync") { (promise: Promise) in
      DispatchQueue.main.async {
        // Get root view controller
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first,
              let rootViewController = window.rootViewController else {
          promise.reject("NO_ROOT_VIEW_CONTROLLER", "Could not find root view controller")
          return
        }
        
        // Read client IDs from Info.plist (set by config plugin)
        guard let iosClientId = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String else {
          promise.reject("MISSING_GID_CLIENT_ID", "GIDClientID not found in Info.plist. Ensure Google Auth config plugin is configured.")
          return
        }
        
        // Server client ID is optional
        let webClientId = Bundle.main.object(forInfoDictionaryKey: "GIDServerClientID") as? String
        
        // Generate nonce for additional security (matching Android implementation)
        let nonce = self.generateNonce()
        
        // Validate that the required URL scheme is registered
        let expectedUrlScheme = self.generateReversedClientId(from: iosClientId)
        if !self.isUrlSchemeRegistered(expectedUrlScheme) {
          promise.reject("MISSING_URL_SCHEME", "URL scheme '\(expectedUrlScheme)' is not registered in Info.plist. Config plugin should handle this automatically.")
          return
        }
        
        // Create configuration from Info.plist values
        let config = GIDConfiguration(clientID: iosClientId, serverClientID: webClientId)
        
        // Set the configuration
        GIDSignIn.sharedInstance.configuration = config
        
        // Perform sign-in
        GIDSignIn.sharedInstance.signIn(withPresenting: rootViewController) { result, error in
          if let error = error {
            let errorCode = (error as NSError).code
            let errorMessage = error.localizedDescription
            
            // Handle specific Google Sign-In error codes
            switch errorCode {
            case -2: // User cancelled
              promise.reject("SIGN_IN_CANCELLED", "User cancelled sign-in")
            case -4: // No internet connection
              promise.reject("NO_INTERNET", "No internet connection")
            case -5: // Keychain error
              promise.reject("KEYCHAIN_ERROR", "Keychain access error")
            default:
              promise.reject("SIGN_IN_FAILED", errorMessage)
            }
            return
          }
          
          guard let user = result?.user else {
            promise.reject("NO_USER", "Failed to get user information")
            return
          }
          
          guard let idToken = user.idToken?.tokenString else {
            promise.reject("NO_ID_TOKEN", "Failed to get ID token")
            return
          }
          
          // Match Android response format exactly
          promise.resolve([
            "success": true,
            "idToken": idToken,
            "nonce": nonce
          ])
        }
      }
    }

    AsyncFunction("signOutAsync") { (promise: Promise) in
      DispatchQueue.main.async {
        GIDSignIn.sharedInstance.signOut()
        promise.resolve(nil)
      }
    }

    View(GoogleAuthView.self) {
      Prop("url") { (view: GoogleAuthView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
  
  // Generate nonce for additional security (matching Android implementation)
  private func generateNonce() -> String {
    var data = Data(count: 32)
    let result = data.withUnsafeMutableBytes { ptr in
      SecRandomCopyBytes(kSecRandomDefault, 32, ptr.bindMemory(to: UInt8.self).baseAddress!)
    }
    
    guard result == errSecSuccess else {
      fatalError("Failed to generate random bytes for nonce")
    }
    
    return data.map { String(format: "%02hhx", $0) }.joined()
  }
  
  // Generate reversed client ID for URL scheme
  private func generateReversedClientId(from clientId: String) -> String {
    // Convert "123456-abc.apps.googleusercontent.com" to "com.googleusercontent.apps.123456-abc"
    let components = clientId.components(separatedBy: ".apps.googleusercontent.com")
    guard let firstPart = components.first else {
      return clientId // fallback to original if format is unexpected
    }
    return "com.googleusercontent.apps.\(firstPart)"
  }
  
  // Check if URL scheme is registered in Info.plist
  private func isUrlSchemeRegistered(_ scheme: String) -> Bool {
    guard let urlTypes = Bundle.main.infoDictionary?["CFBundleURLTypes"] as? [[String: Any]] else {
      return false
    }
    
    for urlType in urlTypes {
      if let schemes = urlType["CFBundleURLSchemes"] as? [String],
         schemes.contains(scheme) {
        return true
      }
    }
    
    return false
  }
}