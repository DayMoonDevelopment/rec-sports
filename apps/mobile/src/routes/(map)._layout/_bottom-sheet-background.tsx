import { View } from "react-native";

import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

export const BottomSheetBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  // render
  return <View style={style} className="bg-background rounded-3xl" />;
};
