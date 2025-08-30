import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type GoogleAuthModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onSignInResult: (params: GoogleSignInResult) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type GoogleSignInResult = {
  success: boolean;
  idToken?: string;
  nonce?: string;
  error?: string;
};

export type GoogleAuthViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
