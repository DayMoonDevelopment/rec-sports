// Reexport the native module. On web, it will be resolved to GoogleAuthModule.web.ts
// and on native platforms to GoogleAuthModule.ts
export { default } from './src/GoogleAuthModule';
export { default as GoogleAuthView } from './src/GoogleAuthView';
export * from  './src/GoogleAuth.types';
