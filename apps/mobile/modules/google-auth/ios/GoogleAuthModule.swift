import ExpoModulesCore
import GoogleSignIn
import UIKit

public class GoogleAuthModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GoogleAuth")

    Constants([
      "PI": Double.pi
    ])

    Events("onChange", "onSignInResult")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    AsyncFunction("signInAsync") { (options: [String: Any], promise: Promise) in
      guard let webClientId = options["webClientId"] as? String else {
        promise.reject("MISSING_WEB_CLIENT_ID", "webClientId is required")
        return
      }
      
      guard let iosClientId = options["iosClientId"] as? String else {
        promise.reject("MISSING_IOS_CLIENT_ID", "iosClientId is required for iOS")
        return
      }
      
      DispatchQueue.main.async {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first,
              let rootViewController = window.rootViewController else {
          promise.reject("NO_ROOT_VIEW_CONTROLLER", "Could not find root view controller")
          return
        }
        
        guard let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") else {
          promise.reject("MISSING_CONFIG", "GoogleService-Info.plist not found")
          return
        }
        
        guard let config = GIDConfiguration(path: path) else {
          promise.reject("INVALID_CONFIG", "Invalid GoogleService-Info.plist")
          return
        }
        
        GIDSignIn.sharedInstance.configuration = config
        
        GIDSignIn.sharedInstance.signIn(withPresenting: rootViewController) { result, error in
          if let error = error {
            promise.reject("SIGN_IN_FAILED", error.localizedDescription)
            return
          }
          
          guard let user = result?.user,
                let idToken = user.idToken?.tokenString else {
            promise.reject("NO_ID_TOKEN", "Failed to get ID token")
            return
          }
          
          promise.resolve([
            "success": true,
            "idToken": idToken
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
}