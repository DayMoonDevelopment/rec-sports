import { Text, Pressable } from "react-native";

interface GridPreviewCardProps {
  name: string;
  score: number | null;
  onPress: () => void;
}

export function GridPreviewCard({
  name,
  score,
  onPress,
}: GridPreviewCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex flex-row gap-2 items-center px-4 py-2 rounded-full border border-border opacity-100 active:opacity-50 transition-opacity`}
    >
      <Text
        className={`text-lg font-bold text-foreground`}
      >{`${score ? score : "-"}`}</Text>
      <Text className="flex-1 text-base text-foreground" numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}
