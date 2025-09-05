import type { FieldPolicy, Reference } from "@apollo/client/cache";

type KeyArgs = FieldPolicy<any>["keyArgs"];

interface PageInfo {
  endCursor?: string | null;
  hasNextPage: boolean;
}

interface CursorPaginatedResponse<T = Reference> {
  nodes: T[];
  hasMore: boolean;
  totalCount: number;
  pageInfo: PageInfo;
}

/**
 * Field policy for cursor-based pagination that handles the GraphQL schema pattern
 * with response objects containing `nodes`, `hasMore`, `totalCount`, and `pageInfo` fields.
 * Used for queries like `locations` that support cursor-based pagination.
 *
 * @param keyArgs - `keyArgs` that should be applied to the field policy
 * @returns The field policy that handles cursor-based pagination with nodes array
 */
export function cursorPagination<T = Reference>(
  keyArgs: KeyArgs = false,
): FieldPolicy<CursorPaginatedResponse<T>> {
  return {
    keyArgs,
    merge(existing, incoming, { args }): CursorPaginatedResponse<T> {
      if (!incoming) {
        return existing || { 
          nodes: [], 
          hasMore: false, 
          totalCount: 0,
          pageInfo: { hasNextPage: false, endCursor: null }
        };
      }

      const existingNodes = existing?.nodes || [];
      const incomingNodes = incoming.nodes || [];

      // If no args (initial load) or no existing data, return incoming
      if (!args || !existing) {
        return {
          nodes: incomingNodes,
          hasMore: incoming.hasMore,
          totalCount: incoming.totalCount,
          pageInfo: incoming.pageInfo,
        };
      }

      // If this is a fresh query (no after cursor), replace existing
      if (!args.after) {
        return {
          nodes: incomingNodes,
          hasMore: incoming.hasMore,
          totalCount: incoming.totalCount,
          pageInfo: incoming.pageInfo,
        };
      }

      // Otherwise, append to existing nodes (pagination)
      return {
        nodes: [...existingNodes, ...incomingNodes],
        hasMore: incoming.hasMore,
        totalCount: incoming.totalCount,
        pageInfo: incoming.pageInfo,
      };
    },
  };
}

