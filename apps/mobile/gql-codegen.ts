import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema:
    process.env.EXPO_PUBLIC_GQL_DATA_URL || "http://localhost:4000/graphql",
  documents: [
    "src/**/*.{ts,tsx,graphql}",
    "!src/gql/**/*",
    "!src/**/*.generated.ts",
  ],
  generates: {
    // Generate base types (scalars, enums, input types, etc.) in a central location
    "./src/gql/types.ts": {
      plugins: ["typescript"],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
    },
    // Generate operation-specific types collocated with their queries
    "./src/": {
      preset: "near-operation-file",
      presetConfig: {
        extension: ".generated.ts",
        baseTypesPath: "gql/types.ts",
        // Disable fragment masking for Apollo Client compatibility
        fragmentMasking: false,
      },
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
    },
  },
};

export default config;
