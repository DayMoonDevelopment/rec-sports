import { MMKV, Mode, useMMKV, useMMKVString } from "react-native-mmkv";

const USER_STORAGE_ID = "user";

export const userStorage = new MMKV({
  id: USER_STORAGE_ID,
  encryptionKey: "hunter2",
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});

export function useUserToken() {
  const _userStorage = useMMKV({ id: USER_STORAGE_ID });
  return useMMKVString("user.token", _userStorage);
}
