import type { FieldPolicy, Reference } from "@apollo/client/cache";

type KeyArgs = FieldPolicy<any>["keyArgs"];

interface PaginatedResponse<T = Reference> {
  nodes: T[];
  hasMore: boolean;
  totalCount: number;
}

/**
 * Field policy for offset/limit pagination that handles the GraphQL schema pattern
 * with response objects containing `nodes`, `hasMore`, and `totalCount` fields.
 * Used for queries like `games` and `locations` that return paginated responses.
 *
 * @param keyArgs - `keyArgs` that should be applied to the field policy
 * @returns The field policy that handles offset/limit pagination with nodes array
 */
export function offsetLimitPagination<T = Reference>(
  keyArgs: KeyArgs = false,
): FieldPolicy<PaginatedResponse<T>> {
  return {
    keyArgs,
    merge(existing, incoming, { args }): PaginatedResponse<T> {
      if (!incoming) {
        return existing || { nodes: [], hasMore: false, totalCount: 0 };
      }

      const existingNodes = existing?.nodes || [];
      const incomingNodes = incoming.nodes || [];

      if (!args) {
        return {
          nodes: [...existingNodes, ...incomingNodes],
          hasMore: incoming.hasMore,
          totalCount: incoming.totalCount,
        };
      }

      const { offset = 0 } = args;
      const merged = existingNodes.slice(0);

      for (let i = 0; i < incomingNodes.length; i++) {
        merged[offset + i] = incomingNodes[i];
      }

      return {
        nodes: merged,
        hasMore: incoming.hasMore,
        totalCount: incoming.totalCount,
      };
    },
  };
}
