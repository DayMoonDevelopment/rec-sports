import { View } from "react-native";
import { useState } from "react";

import { SearchHeader } from "./_search-header";
import { Feed } from "./_feed";
import { SearchFeed } from "./_search-feed";

export function Component() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  return (
    <View className="flex-1">
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchMode={isSearchMode}
        setIsSearchMode={setIsSearchMode}
      />
      {isSearchMode ? <SearchFeed searchQuery={searchQuery} /> : <Feed />}
    </View>
  );
}
