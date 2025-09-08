import { Alert } from "react-native";

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmation() {
  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        options.title,
        options.message,
        [
          {
            text: options.cancelText || "Cancel",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: options.confirmText || "Confirm",
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      );
    });
  };

  return { confirm };
}
