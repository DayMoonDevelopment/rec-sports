import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.gql',
  generates: {
    '../types/src/generated/graphql.ts': {
      plugins: ['typescript'],
      config: {
        // Configure TypeScript generation
        scalars: {
          ID: 'string',
          String: 'string',
          Boolean: 'boolean',
          Int: 'number',
          Float: 'number',
        },
        // Add useful utilities
        maybeValue: 'T | null | undefined',
        inputMaybeValue: 'T | null | undefined',
      },
    },
    '../types/src/generated/gql.ts': {
      plugins: ['typescript', 'gql-tag-operations'],
      documents: [], // No documents needed for type-safe gql function
      config: {
        // Configure TypeScript generation
        scalars: {
          ID: 'string',
          String: 'string',
          Boolean: 'boolean',
          Int: 'number',
          Float: 'number',
        },
        // Enable the type-safe gql function
        gqlImport: 'graphql-tag#gql',
        useTypeImports: true,
      },
    },
  },
};

export default config;
