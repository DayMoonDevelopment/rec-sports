import { Pressable, Text, Dimensions } from "react-native";
import { cva } from "class-variance-authority";
import type { TeamItemProps } from "../score-context";

const width = Dimensions.get("window").width;

const containerStyles = cva(
  "flex-1 rounded-3xl border border-border p-4 opacity-100 active:opacity-50 tarnsition-opacity",
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

const textStyles = cva("text-xl", {
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

const sheetSizeCorrection = 16 * 2;
const halfScreen = (width - sheetSizeCorrection) * 0.5;
const itemSeparatorCorrection = 8 * 0.5;
const itemWidth = halfScreen - itemSeparatorCorrection;

export function TeamItem({ id, name, onPress, selected }: TeamItemProps) {
  return (
    <Pressable
      className={containerStyles({ selected })}
      onPress={onPress}
      style={{ width: itemWidth }}
    >
      <Text className={textStyles({ selected })}>{name}</Text>
    </Pressable>
  );
}
