import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as CoreApolloProvider,
} from "@apollo/client";
import { setLogVerbosity } from "@apollo/client/core";
import { persistCache, MMKVWrapper } from "apollo3-cache-persist";
import { MMKV, Mode } from "react-native-mmkv";

import { cursorPagination } from "~/lib/cursor-pagination";

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
        locations: cursorPagination(["query", "region", "sports"]),
        games: cursorPagination([
          "gameState",
          "locationId",
          "sport",
          "teamId",
          "userId",
        ]),
      },
    },
    Location: {
      keyFields: ["id"],
    },
    Game: {
      keyFields: ["id"],
    },
    Team: {
      keyFields: ["id"],
    },
    GameEvent: {
      keyFields: ["id"],
    },
    User: {
      keyFields: ["id"],
    },
    Address: {
      keyFields: ["id"],
    },
    TeamMember: {
      keyFields: ["id"],
    },
  },
};

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const { setProviderReady } = useAppReady();

  useEffect(() => {
    const initializeCache = async () => {
      try {
        // Enable Apollo Client logging in development
        if (__DEV__) {
          setLogVerbosity("debug");
          console.log("Apollo Client: Debug logging enabled");
        }

        const cache = new InMemoryCache(cacheConfig);

        // Add cache event listeners for debugging
        if (__DEV__) {
          const originalRead = cache.read.bind(cache);
          const originalWrite = cache.write.bind(cache);

          cache.read = function <T>(
            ...args: Parameters<typeof originalRead>
          ): T | null {
            const result = originalRead(...args);
            console.log("Apollo Cache READ:", args[0], result ? "HIT" : "MISS");
            return result as T | null;
          };

          cache.write = function (...args: Parameters<typeof originalWrite>) {
            console.log("Apollo Cache WRITE:", args[0]);
            return originalWrite(...args);
          };
        }

        await persistCache({
          cache,
          storage: new MMKVWrapper(storage),
        });

        setClient(
          new ApolloClient({
            uri: DATA_URL,
            cache,
            defaultOptions: {
              watchQuery: {
                fetchPolicy: "cache-and-network",
              },
              query: {
                fetchPolicy: "cache-first",
              },
            },
          }),
        );

        setProviderReady("apollo-cache");

        if (__DEV__) {
          console.log(
            "Apollo Client initialized with cache-and-network policy",
          );
        }
      } catch (error) {
        console.error("Error initializing Apollo cache:", error);
      }
    };

    initializeCache();
  }, [setProviderReady]);

  if (!client) return null;

  return <CoreApolloProvider client={client}>{children}</CoreApolloProvider>;
};
