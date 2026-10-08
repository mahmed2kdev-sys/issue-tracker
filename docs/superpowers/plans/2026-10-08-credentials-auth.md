# Credentials Auth + Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add email/password login and self-registration alongside Google login.

**Architecture:** Credentials provider on the existing `PrismaAdapter` + `jwt` session; nullable `User.password`; shared zod schemas; custom `/login` + `/register` client pages with a Google button.

**Tech Stack:** Next 16.3.6, next-auth v5 beta, Prisma 7 + MariaDB adapter, bcryptjs, zod v4, react-hook-form + @hookform/resolvers, @radix-ui/themes.

**Spec:** `docs/superpowers/specs/2026-10-08-credentials-auth-design.md`

## Global Constraints

- Session strategy stays `jwt` (Credentials is unsupported with database sessions).
- `User.password` is nullable so Google-only users keep working.
- Never return the password hash from any API.
- Login failure returns a generic "Invalid email or password" (no enumeration).
- No new UI/CSS framework; Google "G" is an inline SVG.
- No test runner in repo; verification is `tsc` + `lint` + `build` + manual endpoint checks.

## Review Focus

- Duplicate registration (same email twice) → second gets `409` with "already registered", no user created.
- Login with correct email but wrong password → generic error, no session, no indication the email exists.
- Google-only user (NULL password) logging in via credentials → generic error, no crash.
- Empty/short password or malformed email on register and login → `400`/inline field error, no DB write.
- Unauthenticated visit to `/issues/new` → redirect to `/login` (not `/api/auth/signin`), and after login returns to the original page.

---

### Task 1: Password column + hashing dep

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `package.json` (via install)

**Interfaces:**
- Consumes: nothing.
- Produces: `User.password: String?`; `bcryptjs.hash/compare` available.

- [ ] **Step 1: Add `password String?` to `User` in `prisma/schema.prisma`.**
- [ ] **Step 2: Install dep.**

Run: `npm install bcryptjs && npm install --save-dev @types/bcryptjs`
Expected: both appear in `package.json`.
- [ ] **Step 3: Migrate and regenerate.**

Run: `npx prisma migrate dev --name add-user-password` then `npx prisma generate`
Expected: migration applies cleanly, no data loss (new nullable column).
- [ ] **Step 4: Typecheck.**

Run: `npx tsc --noEmit`
Expected: PASS.
- [ ] **Step 5: Commit.**

```bash
git add prisma/schema.prisma prisma/migrations package.json package-lock.json
git commit -m "feat(auth): add nullable user password and bcryptjs"
```

### Task 2: Shared validation schemas

**Files:**
- Modify: `app/ValidationSchemas.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `registerSchema: z.object({ name, email, password })`, `loginSchema: z.object({ email, password })` for reuse by Task 4, 6, 7.

- [ ] **Step 1: Add `registerSchema` (name optional max 255, valid email, password min 8 max 128) and `loginSchema` (valid email, password min 1) to `app/ValidationSchemas.ts`.**
- [ ] **Step 2: Typecheck + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
- [ ] **Step 3: Commit.**

```bash
git add app/ValidationSchemas.ts
git commit -m "feat(auth): add register and login schemas"
```

### Task 3: Register endpoint

**Files:**
- Create: `app/api/register/route.ts`

**Interfaces:**
- Consumes: `registerSchema` (Task 2), `prisma.user` (existing), `bcryptjs.hash`.
- Produces: `POST /api/register -> 201 { id, email, name } | 400 | 409`.

- [ ] **Step 1: Implement `POST(req: Request)` in `app/api/register/route.ts`:** parse JSON, `registerSchema.safeParse` → `400` on fail; `findUnique({ where: { email } })` → `409` if exists; `hash(password, 10)`; `create({ data: { name, email, password: hash } })`; return `201` with `{ id, email, name }` only.
- [ ] **Step 2: Typecheck + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.
- [ ] **Step 3: Manual check (dev server running): register → duplicate → bad input.**

Run: `curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/register -H 'Content-Type: application/json' -d '{"email":"plan-check@example.com","password":"password123"}'` (expect `201` first run); repeat same (expect `409`); send `{"email":"x","password":"1"}` (expect `400`).
- [ ] **Step 4: Commit.**

```bash
git add app/api/register/route.ts
git commit -m "feat(auth): add registration endpoint"
```

### Task 4: NextAuth credentials + env fix

**Files:**
- Modify: `app/auth/authOptions.ts`
- Modify: `.env` (rename Google keys)

**Interfaces:**
- Consumes: `prisma.user` (existing), `bcryptjs.compare`, `loginSchema` (Task 2).
- Produces: credentials login works; session carries `user.id`; `/login` is the sign-in page.

- [ ] **Step 1: In `app/auth/authOptions.ts`, add `import Credentials from "next-auth/providers/credentials"` and a `Credentials({ credentials: { email: {}, password: {} }, authorize })` entry:** `loginSchema.safeParse` → `null` on fail; `findUnique` by email → `null` if missing or `!user.password`; `compare(password, user.password)` → `null` if false; else return `{ id: user.id, email, name }`. Add `pages: { signIn: "/login" }` and `jwt`/`session` callbacks copying `user.id` to token/session.
- [ ] **Step 2: Fix env mismatch:** rename to `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` in `.env` and read those exact names in `authOptions.ts` (Google is currently broken by this mismatch).
- [ ] **Step 3: Typecheck + lint + build.**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS.
- [ ] **Step 4: Manual check: bad password rejected, Google provider still listed.**

Run: start dev server, `signIn("credentials")` with wrong password shows generic error and no session; repeat with a Google-only user (NULL password) → same generic error, no crash; `/api/auth/providers` still lists `google` and `credentials`.
- [ ] **Step 5: Commit.**

```bash
git add app/auth/authOptions.ts .env
git commit -m "feat(auth): add credentials provider and fix google env keys"
```

### Task 5: Login page + skeleton

**Files:**
- Create: `app/login/page.tsx`
- Create: `app/login/loading.tsx`

**Interfaces:**
- Consumes: `loginSchema` (Task 2), `signIn` from `next-auth/react`, `Skeleton` from `@/app/components`.
- Produces: `/login` route with credentials form + Google "G" button + link to `/register`.

- [ ] **Step 1: Implement `app/login/page.tsx` as a client component** following the existing hook-form + zod + Radix `Card`/`TextField`/`Button`/`Callout` pattern: fields email/password, submit → `signIn("credentials", { email, password, callbackUrl })`, generic error Callout on failure; "Sign in with Google" button with inline multicolor "G" SVG → `signIn("google", { callbackUrl })`; link to `/register`. Read `callbackUrl` from search params, default `/`.
- [ ] **Step 2: Implement `app/login/loading.tsx`** with `Skeleton` blocks matching the Card/form shape.
- [ ] **Step 3: Typecheck + lint + build.**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS.
- [ ] **Step 4: Commit.**

```bash
git add app/login/page.tsx app/login/loading.tsx
git commit -m "feat(auth): add custom login page with google option"
```

### Task 6: Register page + skeleton

**Files:**
- Create: `app/register/page.tsx`
- Create: `app/register/loading.tsx`

**Interfaces:**
- Consumes: `registerSchema` (Task 2), `POST /api/register` (Task 3), `signIn` from `next-auth/react`, `Skeleton` from `@/app/components`.
- Produces: `/register` route creating a user then signing them in.

- [ ] **Step 1: Implement `app/register/page.tsx` as a client component** with the same form pattern: fields name/email/password, submit → `POST /api/register`, surface `409` as "email already registered" and field errors inline; on `201` → `signIn("credentials", ...)`; include Google button (same inline "G" SVG) and link back to `/login`.
- [ ] **Step 2: Implement `app/register/loading.tsx`** with `Skeleton` blocks matching the form shape.
- [ ] **Step 3: Typecheck + lint + build.**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS.
- [ ] **Step 4: End-to-end manual check: register a fresh email → lands authenticated; duplicate → 409 message.**

Run: use the page or curl + login flow; confirm session exists after success.
- [ ] **Step 5: Commit.**

```bash
git add app/register/page.tsx app/register/loading.tsx
git commit -m "feat(auth): add registration page"
```

### Task 7: Redirects + final verification

**Files:**
- Modify: `app/auth/AuthStatus.tsx:46-53`
- Modify: `proxy.ts:9-11`

**Interfaces:**
- Consumes: `/login` (Task 5).
- Produces: unauthenticated users land on `/login` with working `callbackUrl` round-trip.

- [ ] **Step 1: Point the Log in link in `AuthStatus.tsx` at `/login?callbackUrl=...` and the `proxy.ts` redirect at `/login?callbackUrl=...` (preserve the current pathname).**
- [ ] **Step 2: Final verification.**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS. Manual: logged-out visit to `/issues/new` → `/login`; after credentials login returns to `/issues/new`; logged-out Google flow still works.
- [ ] **Step 3: Commit.**

```bash
git add app/auth/AuthStatus.tsx proxy.ts
git commit -m "feat(auth): route auth-gated redirects to custom login"
```
