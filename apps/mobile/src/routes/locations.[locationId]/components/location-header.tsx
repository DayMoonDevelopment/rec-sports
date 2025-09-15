import { View, Text, Pressable } from "react-native";

import { CrossIcon } from "~/icons/cross";

interface LocationHeaderProps {
  name: string;
  onClose: () => void;
}

export function LocationHeader({ name, onClose }: LocationHeaderProps) {
  return (
    <View className="flex flex-row items-start justify-between gap-2">
      <View className="flex-1 flex flex-col gap-1">
        <Text className="flex-1 text-3xl font-bold text-foreground pt-3">
          {name}
        </Text>
      </View>

      <Pressable
        className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
        onPress={onClose}
      >
        <CrossIcon height={22} width={22} />
      </Pressable>
    </View>
  );
}
