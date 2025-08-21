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
        useTypeImports: true,
      },
    },
  },
};

export default config;
