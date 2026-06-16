// Plain JS shim — NestJS CLI compiles src/lambda.ts → dist/lambda.js
// with all src/ imports resolved to relative paths.
// Vercel runs this file; it delegates to the pre-built dist at runtime.

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require('../dist/lambda').default;
