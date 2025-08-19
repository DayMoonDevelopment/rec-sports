import { DocumentNode } from 'graphql';
import { TypedDocumentNode as DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';

/**
 * Type-safe gql template literal tag.
 * This provides full TypeScript intellisense for GraphQL operations.
 * 
 * Usage:
 * ```typescript
 * import { gql } from '@rec/types';
 * 
 * const GET_LOCATIONS = gql`
 *   query GetLocations($page: Page) {
 *     locations(page: $page) {
 *       nodes {
 *         id
 *         name
 *         latitude
 *         longitude
 *       }
 *     }
 *   }
 * `;
 * ```
 */
export function typedGql<TResult, TVariables>(
  source: TemplateStringsArray,
  ...args: any[]
): DocumentTypeDecoration<TResult, TVariables> {
  return gql(source, ...args) as any;
}

// Export as default gql function for convenience
export { typedGql as gql };