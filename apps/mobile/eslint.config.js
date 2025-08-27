// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const graphqlPlugin = require('@graphql-eslint/eslint-plugin');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'src/gql/**/*', '**/*.generated.ts'],
  },
  // GraphQL files linting
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    rules: {
      '@graphql-eslint/known-type-names': 'error',
      '@graphql-eslint/no-deprecated': 'warn',
      '@graphql-eslint/unique-operation-name': 'error',
      '@graphql-eslint/require-selections': 'warn',
    },
  },
  // GraphQL operations in TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    rules: {
      '@graphql-eslint/known-type-names': 'error',
    },
    processor: '@graphql-eslint/graphql',
  },
]);
