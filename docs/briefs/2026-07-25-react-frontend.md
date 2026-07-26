# React Frontend for E-Commerce API — Build Brief

**Goal:** A production-ready React storefront + admin panel in `frontend/` inside this repo, consuming the existing Spring Boot API.

**Context:** Backend exposes `/api/v1/auth` (register/login → JWT), `/api/v1/products` (public GET paginated, ADMIN CUD), `/api/v1/orders` (authenticated place/list/get, ADMIN PATCH status). No CORS config on backend. Roles: `USER`, `ADMIN`. Order statuses: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED.

**Approach:** Vite + React 18 (plain JS) + Tailwind CSS v3 + React Router v6 + Axios + React Query (TanStack) for server state + react-hot-toast for notifications. Vite dev proxy `/api` → `http://localhost:8080` (avoids CORS, no backend change). JWT kept in memory + `sessionStorage` (never localStorage), attached via Axios interceptor; 401 response → auto-logout redirect.
- *Rejected:* MUI/AntD — user chose Tailwind. Redux — React Query + Context is lighter and sufficient. Backend CORS config — proxy is less invasive.

**File map (all under `frontend/`):**
- `vite.config.js` — Vite + proxy `/api` → :8080; vitest config
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` — Tailwind setup + theme (indigo/slate neutral palette)
- `index.html`, `src/main.jsx`, `src/App.jsx` — entry, providers, routes
- `src/api/client.js` — Axios instance + JWT interceptor + 401 handler
- `src/api/auth.js`, `src/api/products.js`, `src/api/orders.js` — typed API functions matching backend DTOs exactly
- `src/context/AuthContext.jsx` — login/register/logout, sessionStorage sync, role helpers
- `src/context/CartContext.jsx` — cart add/remove/qty/total (client-side only)
- `src/components/` — `Navbar`, `ProtectedRoute`, `AdminRoute`, `Spinner`, `StatusBadge`, `Pagination`, `ProductCard`
- `src/pages/` — `HomePage` (catalog grid, paginated), `ProductDetailPage`, `LoginPage`, `RegisterPage`, `CartPage` (checkout → POST /orders), `OrdersPage`, `OrderDetailPage`, `admin/AdminProductsPage` (CRUD + modal form), `admin/AdminOrdersPage` (status update)
- Co-located `*.test.jsx` files (Vitest + React Testing Library + user-event); `src/test/setup.js`

**Routes:** `/` catalog · `/products/:id` · `/login` · `/register` · `/cart` · `/orders` · `/orders/:id` · `/admin/products` · `/admin/orders`

**Security & observability impact:** JWT in sessionStorage (approved by user; localStorage forbidden). No secrets in code. `npm audit` gate at completion. Frontend console logging minimal; no PII logged.

**Constitution check:** no constitution.

**Out of scope:** backend changes, payment integration, product images upload, user profile editing, deployment config, i18n.

## Tasks (TDD batch; check off as you go)
- [x] 1. Scaffold: Vite app + Tailwind + deps + vitest setup → smoke test green
- [x] 2. `api/client.js` + auth/products/orders API modules: tests (interceptor, 401) → RED → implement → GREEN
- [x] 3. `AuthContext`: tests (login/logout/session restore/role) → RED → implement → GREEN
- [x] 4. `CartContext`: tests (add/remove/qty/total) → RED → implement → GREEN
- [x] 5. Shared components (Navbar, ProtectedRoute, AdminRoute, StatusBadge, Pagination, ProductCard): tests → RED → implement → GREEN
- [x] 6. Catalog + ProductDetail pages: tests → RED → implement → GREEN
- [x] 7. Login/Register pages: tests → RED → implement → GREEN
- [x] 8. Cart + checkout page: tests → RED → implement → GREEN
- [x] 9. Orders + OrderDetail pages: tests → RED → implement → GREEN
- [x] 10. Admin products page (CRUD): tests → RED → implement → GREEN
- [x] 11. Admin orders page (status update): tests → RED → implement → GREEN
- [x] 12. verification-before-completion — 77/77 tests green, coverage 98.9% stmts, build OK, README section added. `npm audit`: 2 findings remain in react-router 7.18 (RSC/SSR server-mode CSRF — not applicable to this client-only SPA; npm's only fix is a downgrade that reintroduces an open-redirect CVE).
- [ ] 13. offer a code review — dispatch `code-reviewer` only if the user accepts
- [ ] 14. finishing-a-development-branch — commit locally, hand off
