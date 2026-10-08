# Credentials Auth + Registration Design

Date: 2026-10-08. Approved in-chat design; this is the written spec.

## Intent

Add email/password login alongside existing Google login, plus self-registration.
Success: user can register, log in with credentials, log in with Google from the
same custom login form; `/issues/new` and `/issues/edit/*` gating still works.

Assumptions confirmed: custom `/login` + `/register` pages in app style;
keep Google button with "G" logo on the login form.

## Constraints

- Stack: Next 16.3.6, next-auth v5 beta (Auth.js), Prisma 7 + MariaDB adapter,
  zod v4, react-hook-form + @hookform/resolvers, @radix-ui/themes.
- Session strategy stays `jwt` (already set). Credentials does not work with
  database sessions, so no change here.
- `User.password` must be nullable so Google-only users keep working.
- No new UI/CSS framework. Inline SVG for the Google "G" (brand colors).

## Approaches considered

1. **Credentials + PrismaAdapter + jwt (chosen).** Minimal diff, keeps Google.
2. Database-session credentials — rejected, unsupported by Auth.js Credentials.
3. Separate password-only user store — rejected, two sources of truth.

Hashing: `bcryptjs` (pure JS, no native build, standard for Auth.js examples).

## Design

### Data: `prisma/schema.prisma`

- Add `password String?` to `User`. One migration. Nothing else changes.

### Auth config: `app/auth/authOptions.ts`

- Keep `PrismaAdapter(prisma)`, keep Google provider, add `Credentials`:
  - `credentials: { email, password }`, `authorize()` zod-validates input,
    finds user by email, `bcrypt.compare`, returns `{ id, email, name }` or `null`.
  - Returns `null` (not throw) on bad credentials so Auth.js shows generic error.
- Add `pages: { signIn: "/login" }`.
- Add `jwt`/`session` callbacks to carry `user.id` onto the session (needed for
  issue assignment / `assignedToUserId` flows).
- Fix pre-existing env mismatch in same diff: `.env` defines
  `AUTH_GOOGLE_ID/SECRET`, code reads `GOOGLE_CLIENT_ID/SECRET` — Google login
  is currently broken. Rename to `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

### Registration: `POST /api/register` (`app/api/register/route.ts`)

- zod-validate `{ name?, email, password(min 8) }` via shared `registerSchema`.
- `409` if email exists, `400` on validation, `201` with `{ id, email, name }`
  (never return the hash). `bcrypt.hash(password, 10)`.
- Add `registerSchema` to `app/ValidationSchemas.ts` for reuse by API + form.

### UI

- `app/login/page.tsx` (client): email/password form (hook-form + zod +
  Radix `TextField`/`Button`/`Card`), error Callout on failure, calls
  `signIn("credentials", { email, password, callbackUrl })`; Google button with
  inline "G" SVG calls `signIn("google", { callbackUrl })`; link to `/register`.
- `app/register/page.tsx` (client): name/email/password form, posts to
  `/api/register`, then `signIn("credentials", ...)`; Google button included;
  link back to `/login`.
- `app/login/loading.tsx` + `app/register/loading.tsx`: route-level skeletons
  using the existing `Skeleton` component (`app/components/Skeleton.tsx`),
  matching the Card/form shape while the client pages load.
- `AuthStatus.tsx:46-53`: point Log in link at `/login` (preserve callbackUrl).
- `proxy.ts:9-11`: redirect unauthenticated to `/login?callbackUrl=...` instead
  of `/api/auth/signin`.

### Error handling

- Register: field errors inline, `409` surfaces as "email already registered".
- Login: single generic "Invalid email or password" (no user enumeration).
- Hash failures / DB errors: generic 500, no leak.

### Testing

- `POST /api/register` → `201`; duplicate → `409`; short password / bad email → `400`.
- Login good password → session; bad password → generic error, no session.
- Google login still works; `/issues/new` redirects to `/login` when logged out.

## Out of scope

Email verification, password reset, rate-limiting. Add when abuse matters.
