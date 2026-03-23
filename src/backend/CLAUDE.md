# Backend - AlgaPSA Extension

This directory contains the backend code for the AlgaPSA extension.

## Critical Constraints

### WASM Runtime Limitations

The entire contents of this directory (starting from `handler.ts`) are compiled to WASM and run in a QuickJS runtime. This imposes strict limitations:

1. **No async/await** - All functions must be synchronous. The WASM runner cannot handle asynchronous code.
2. **No Promises** - Cannot use Promise-based APIs
3. **No Timers** - Cannot use `setTimeout`, `setInterval`, etc.
4. **Polyfilled APIs** - `TextEncoder`/`TextDecoder` are polyfilled in `polyfill.ts` since native browser APIs aren't available

### Serverless-like Execution Model

Each request is processed independently through the handler, then the runtime scales down to zero:

```
HTTP Request → handler() → route matching → handler execution → HTTP Response → shutdown
```

- No persistent state between requests (use storage APIs instead)
- All I/O (HTTP, storage) is provided by the WASM host runtime via aliased imports (`alga:extension/*`)
- Must complete within a single synchronous call stack

## Key Patterns

### Synchronous Everything

All functions must be synchronous due to WASM limitations:

```typescript
// CORRECT - synchronous
export const getDetails = (): ExtensionDetails => {
  const stored = storage.get<ExtensionDetails>(NAMESPACE, KEY);
  return stored ?? defaultDetails;
};

// WRONG - will not work in WASM
export const getDetails = async (): Promise<ExtensionDetails> => {
  return await storage.get(...);
};
```

### Storage Pattern

All feature modules use namespace + key storage:

```typescript
const STORAGE_NAMESPACE = "swo.feature-name";
const STORAGE_KEY = "data";

export const feature = {
  getData: () => storage.get<T>(STORAGE_NAMESPACE, STORAGE_KEY),
  saveData: (value: T) => storage.put(STORAGE_NAMESPACE, STORAGE_KEY, value),
};
```

### Binary Payloads

Request/response bodies are `Uint8Array`. Use utilities from `lib/utils.ts`:

```typescript
import { encode, decode, jsonResponse } from "./lib";

// Encoding objects to binary
const body = encode({ foo: "bar" });

// Decoding binary to objects
const data = decode<MyType>(request.body);

// Creating JSON responses
return jsonResponse({ success: true }, { status: 200 });
```

### Module-as-Object Pattern

Feature modules export object with methods (singleton-like):

```typescript
export const moduleName = {
  getX: (): X => { ... },
  saveX: (changes: XChange): X => { ... }
};
```

## Code Organization

- `handler.ts` - Main entry point with the `routes` array defining all endpoints
- `handlers/` - Request handlers (one per route)
- `features/` - Business logic modules
- `lib/` - Shared utilities and API clients (storage, HTTP, encoding)

## Host Runtime APIs

These are provided by the WASM host via aliased imports (see `lib/alga/` for wrappers):

- `alga:extension/storage` - Key-value storage
- `alga:extension/http` - HTTP client
- `alga:extension/user` - User data
- `alga:extension/log` - Logging
