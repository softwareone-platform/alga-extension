# Handlers API Reference

This directory contains route handlers for the extension backend.

## Routes

### `/extension` - Extension Configuration

**Handler:** `extensionHandler` ([extension.ts](extension.ts))

| Method | Description | Request Body | Response |
|--------|-------------|--------------|----------|
| `GET` | Get extension details | - | `ExtensionDetailsResponseBody` with `hasToken` flag (200) |
| `POST` | Update extension details | `ExtensionDetailsRequestBody` | Updated `ExtensionDetailsResponseBody` (202) |
| Other | - | - | Method not allowed (405) |

**Response variations:**
- `200` - Success (GET)
- `202` - Accepted (POST)
- `400` - Invalid request body
- `405` - Method not allowed

---

### `/billing-configs` - Billing Configurations

**Handler:** `billingConfigsHandler` ([billing-configs.ts](billing-configs.ts))

| Method | Description | Request Body | Response |
|--------|-------------|--------------|----------|
| `GET` | Get all billing configs | - | Array of configs (200) |
| `POST` | Save billing config changes | Array of config changes | Updated configs (202) |
| Other | - | - | Method not allowed (405) |

**Response variations:**
- `200` - Success (GET)
- `202` - Accepted (POST)
- `400` - Invalid request body (expected array)
- `405` - Method not allowed
- `500` - Internal server error

---

### `/statements` - Statement Operations

**Handler:** `statementsHandler` ([statements.ts](statements.ts))

| Method | Description | URL Pattern | Response |
|--------|-------------|-------------|----------|
| `GET` | Get statement by ID | `/statements/{id}?{rql}` | Statement data (200) |
| `GET` | Get statements by RQL | `/statements?{rql}` | Statements data (200) |
| `POST` | (Not implemented) | - | - |
| Other | - | - | Method not allowed (405) |

**Response variations:**
- `200` - Success
- `405` - Method not allowed
- `422` - Extension is not active

---

### `/user` - User Information

**Handler:** `userHandler` ([user.ts](user.ts))

| Method | Description | Request Body | Response |
|--------|-------------|--------------|----------|
| `GET` | Get current user info | - | User object (200) |
| Other | - | - | Method not allowed (405) |

**Response variations:**
- `200` - Success
- `405` - Method not allowed

---

### `/swo/*` - SWO Proxy

**Handler:** `swoHandler` ([swo.ts](swo.ts))

Proxies requests to the SWO API with path filtering based on user type.

| Method | Description | URL Pattern |
|--------|-------------|-------------|
| Any | Proxy to SWO endpoint | `/swo/{swo-path}` |

**Allowed paths by user type:**

| Path | Internal | Client |
|------|----------|--------|
| `/commerce/agreements` | Yes | Yes |
| `/commerce/orders` | Yes | Yes |
| `/commerce/subscriptions` | Yes | Yes |
| `/billing/statements` | Yes | Yes |
| `/accounts/accounts` | Yes | No |
| `/accounts/users` | Yes | No |

**Response variations:**
- Proxied response status from SWO API
- `422` - Extension is not active
- `422` - Extension is not configured (path not allowed for user type)
