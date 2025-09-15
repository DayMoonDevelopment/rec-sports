import { View } from "react-native";

import { LoaderIcon } from "~/icons/loader";

export function LocationLoading() {
  return (
    <View className="justify-center items-center py-8 px-4 min-h-48">
      <View className="animate-spin">
        <LoaderIcon height={24} width={24} />
      </View>
    </View>
  );
}
