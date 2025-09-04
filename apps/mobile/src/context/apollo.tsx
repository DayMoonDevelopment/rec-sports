import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as CoreApolloProvider,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createHttpLink } from "@apollo/client/link/http";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { setLogVerbosity } from "@apollo/client/core";
import { persistCache, MMKVWrapper } from "apollo3-cache-persist";
import { MMKV, Mode } from "react-native-mmkv";

import { cursorPagination } from "~/lib/cursor-pagination";

import { useAppReady } from "~/context/app";

import type { ReactNode } from "react";
import type { InMemoryCacheConfig } from "@apollo/client";

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const DATA_URL = process.env.EXPO_PUBLIC_GQL_DATA_URL;

const storage = new MMKV({
  id: "apollo-cache",
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});

const cacheConfig: InMemoryCacheConfig = {
  possibleTypes: {
    GameAction: ["GameScoreAction"],
  },
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
    GameTeam: {
      keyFields: ["id"],
    },
    GameAction: {
      keyFields: ["id"],
    },
    GameScoreAction: {
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

        // Create error link for better error handling
        const errorLink = onError(
          ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
              console.error(
                "Apollo GraphQL Errors:",
                graphQLErrors.map(({ message, locations, path }) => ({
                  message,
                  locations,
                  path,
                })),
              );
            }

            if (networkError) {
              console.error("Apollo Network Error:", {
                name: networkError.name,
                message: networkError.message,
                stack: networkError.stack,
                operation: operation.operationName,
                variables: operation.variables,
              });

              // Log additional network error details
              if ("statusCode" in networkError) {
                console.error("HTTP Status Code:", networkError.statusCode);
              }
              if ("response" in networkError) {
                console.error("Network Response:", networkError.response);
              }
            }
          },
        );

        // Create HTTP link
        const httpLink = createHttpLink({
          uri: DATA_URL,
        });

        setClient(
          new ApolloClient({
            link: from([errorLink, httpLink]),
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
