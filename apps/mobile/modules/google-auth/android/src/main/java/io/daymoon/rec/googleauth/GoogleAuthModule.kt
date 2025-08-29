package io.daymoon.rec.googleauth

import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.SecureRandom
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class GoogleAuthModule : Module() {
    private lateinit var credentialManager: CredentialManager

    override fun definition() = ModuleDefinition {
        Name("GoogleAuth")

        Events("onSignInResult")

        AsyncFunction("signInAsync") { promise: Promise ->
            val context =
                    appContext.reactContext
                            ?: run {
                                promise.reject("NO_CONTEXT", "Context is not available", null)
                                return@AsyncFunction
                            }

            // Read web client ID from Android resources (set by config plugin)
            val webClientId = try {
                val resourceId = context.resources.getIdentifier(
                    "google_web_client_id",
                    "string",
                    context.packageName
                )
                if (resourceId != 0) {
                    context.getString(resourceId)
                } else {
                    null
                }
            } catch (e: Exception) {
                null
            }

            if (webClientId == null) {
                promise.reject(
                    "MISSING_GOOGLE_WEB_CLIENT_ID",
                    "google_web_client_id not found in Android resources. Ensure Google Auth config plugin is configured with webClientId.",
                    null
                )
                return@AsyncFunction
            }

            credentialManager = CredentialManager.create(context)

            CoroutineScope(Dispatchers.Main).launch {
                try {
                    val nonce = generateNonce()

                    val googleIdOption =
                            GetGoogleIdOption.Builder()
                                    .setFilterByAuthorizedAccounts(false)
                                    .setServerClientId(webClientId)
                                    .setAutoSelectEnabled(true)
                                    .setNonce(nonce)
                                    .build()

                    val request =
                            GetCredentialRequest.Builder()
                                    .addCredentialOption(googleIdOption)
                                    .build()

                    val result =
                            credentialManager.getCredential(
                                    request = request,
                                    context = context,
                            )

                    val credential = result.credential

                    if (credential is androidx.credentials.CustomCredential) {
                        if (credential.type ==
                                        GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
                        ) {
                            val googleIdTokenCredential =
                                    GoogleIdTokenCredential.createFrom(credential.data)

                            promise.resolve(
                                    mapOf(
                                            "success" to true,
                                            "idToken" to googleIdTokenCredential.idToken,
                                            "nonce" to nonce
                                    )
                            )
                        } else {
                            promise.reject(
                                    "INVALID_CREDENTIAL_TYPE",
                                    "Unexpected credential type",
                                    null
                            )
                        }
                    } else {
                        promise.reject("INVALID_CREDENTIAL", "Invalid credential received", null)
                    }
                } catch (e: GetCredentialException) {
                    promise.reject("SIGN_IN_FAILED", e.message ?: "Google Sign-In failed", e)
                } catch (e: Exception) {
                    promise.reject("UNEXPECTED_ERROR", e.message ?: "Unexpected error occurred", e)
                }
            }
        }

        AsyncFunction("signOutAsync") { promise: Promise ->
            val context =
                    appContext.reactContext
                            ?: run {
                                promise.reject("NO_CONTEXT", "Context is not available", null)
                                return@AsyncFunction
                            }

            CoroutineScope(Dispatchers.Main).launch {
                try {
                    credentialManager = CredentialManager.create(context)
                    credentialManager.clearCredentialState(
                            androidx.credentials.ClearCredentialStateRequest()
                    )
                    promise.resolve(null)
                } catch (e: Exception) {
                    promise.reject("SIGN_OUT_FAILED", e.message ?: "Sign out failed", e)
                }
            }
        }
    }

    private fun generateNonce(): String {
        val bytes = ByteArray(32)
        SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
