import { MMKV, Mode, useMMKV, useMMKVString } from "react-native-mmkv";
import GoogleAuthModule from "@rec/expo-google-auth";

const USER_STORAGE_ID = "user";
const USER_TOKEN_KEY = "user.token";

export const userStorage = new MMKV({
  id: USER_STORAGE_ID,
  encryptionKey: "hunter2",
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});

export function useUserToken() {
  const _userStorage = useMMKV({ id: USER_STORAGE_ID });
  return useMMKVString(USER_TOKEN_KEY, _userStorage);
}

export async function signOut() {
  userStorage.delete(USER_TOKEN_KEY);

  try {
    GoogleAuthModule.signOutAsync();
  } catch (e) {
    // todo
  }

  return signOut;
}

export function setUserToken(token: string) {
  userStorage.set(USER_TOKEN_KEY, token);
}
