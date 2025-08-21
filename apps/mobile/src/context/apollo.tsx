import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as CoreApolloProvider,
} from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { persistCache, MMKVWrapper } from "apollo3-cache-persist";
import { MMKV, Mode } from "react-native-mmkv";

import { useAppReady } from "~/context/app";

import type { ReactNode } from "react";
import type { InMemoryCacheConfig } from "@apollo/client";

const DATA_URL = process.env.EXPO_PUBLIC_GQL_DATA_URL;

const storage = new MMKV({
  id: "apollo-cache",
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});

const cacheConfig: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        locations: offsetLimitPagination(),
      },
    },
  },
};

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const { setProviderReady } = useAppReady();

  useEffect(() => {
    const initializeCache = async () => {
      try {
        const cache = new InMemoryCache(cacheConfig);
        await persistCache({
          cache,
          storage: new MMKVWrapper(storage),
        });

        setClient(
          new ApolloClient({
            uri: DATA_URL,
            cache,
          }),
        );

        setProviderReady("apollo-cache");
      } catch (error) {
        console.error("Error initializing Apollo cache:", error);
      }
    };

    initializeCache();
  }, [setProviderReady]);

  if (!client) return null;

  return <CoreApolloProvider client={client}>{children}</CoreApolloProvider>;
};
