import { Pressable, Text } from "react-native";
import { cva } from "class-variance-authority";
import type { ScoreTypeItemProps } from "../score-context";

const containerStyles = cva(
  "rounded-3xl border border-border p-4 opacity-100 active:opacity-50 transition-opacity flex-1 flex flex-row justify-between items-center",
  {
    variants: {
      selected: {
        true: "bg-primary text-primary-foreground",
        false: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

const textStyles = cva("text-lg text-center font-medium", {
  variants: {
    selected: {
      true: "text-primary-foreground",
      false: "text-foreground",
    },
  },
  defaultVariants: {
    selected: false,
  },
});

const valueStyles = cva("text-sm text-center font-bold", {
  variants: {
    selected: {
      true: "text-primary-foreground",
      false: "text-foreground/60",
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export function ScoreTypeItem({
  label,
  value,
  onPress,
  selected,
}: ScoreTypeItemProps) {
  return (
    <Pressable className={containerStyles({ selected })} onPress={onPress}>
      <Text className={textStyles({ selected })}>{label}</Text>
      <Text className={valueStyles({ selected })}>{`+${value}`}</Text>
    </Pressable>
  );
}
