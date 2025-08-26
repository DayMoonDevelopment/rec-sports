import { View } from "react-native";

import { useMap } from "~/components/map.context";
import { SearchHeader } from "./_search-header";
import { Feed } from "./_feed";
import { SearchFeed } from "./_search-feed";

export function Component() {
  const { isSearchMode, searchQuery } = useMap();
  
  return (
    <View className="flex-1">
      <SearchHeader />
      {isSearchMode ? (
        <SearchFeed searchQuery={searchQuery} />
      ) : (
        <Feed />
      )}
    </View>
  );
}
