import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const data = [
    // 12x OPEN
    { title: "Login button unresponsive on slow 3G", description: "On throttled networks the login submit button shows no loading state and appears frozen for 5+ seconds. Add pending state and disable during request.", status: "OPEN" as const },
    { title: "Issue list empty state missing illustration", description: "When filters match zero issues the page shows a blank table. Expected: friendly empty state with clear-filters action.", status: "OPEN" as const },
    { title: "Assignee dropdown slow with 500+ users", description: "The assignee select fetches all users at once and freezes the UI. Should use server search with debounce and pagination.", status: "OPEN" as const },
    { title: "Markdown tables render without borders", description: "Pasting a markdown table into a description renders borderless cells in detail view. Missing table styles in typography config.", status: "OPEN" as const },
    { title: "New issue form loses draft on refresh", description: "Navigating away or refreshing the new-issue page discards typed title and description. Persist draft to localStorage.", status: "OPEN" as const },
    { title: "Status filter not reflected in URL on first load", description: "Opening /issues/list?status=CLOSED directly shows all issues until filter is touched. Read searchParams on mount.", status: "OPEN" as const },
    { title: "Toast error swallowed on issue create failure", description: "When POST /api/issues returns 400 the UI shows no feedback. Surface validation message via toast.", status: "OPEN" as const },
    { title: "Profile image broken for OAuth users", description: "Google avatar URLs return 403 after expiry. Proxy images or refresh on session update.", status: "OPEN" as const },
    { title: "IssueChart crashes with zero data", description: "Recharts bar chart throws when all status counts are zero on a fresh database. Guard empty dataset.", status: "OPEN" as const },
    { title: "Keyboard focus lost after closing delete dialog", description: "Deleting an issue returns focus to body instead of the list. Restore focus to the triggering row for a11y.", status: "OPEN" as const },
    { title: "Timestamps show server timezone not local", description: "createdAt renders in UTC for all users. Format with Intl.DateTimeFormat in user locale.", status: "OPEN" as const },
    { title: "Register allows weak common passwords", description: "Passwords like 'password123' pass the 8-char rule. Add common-password blocklist check.", status: "OPEN" as const },
    // 7x IN_PROGRESS
    { title: "Migrate issue list to server pagination", description: "Client currently loads all issues. Paginating via skip/take on the server to handle 10k+ rows.", status: "IN_PROGRESS" as const },
    { title: "Add optimistic update to status toggle", description: "Status changes wait for round-trip. Implementing optimistic UI with rollback on PATCH failure.", status: "IN_PROGRESS" as const },
    { title: "Fix flaky auth session in Safari ITP", description: "Sessions drop in Safari private mode. Moving to database sessions with shorter rotation.", status: "IN_PROGRESS" as const },
    { title: "Sanitize markdown HTML output", description: "Adding rehype-sanitize to react-markdown rendering to close stored-XSS vector in previews.", status: "IN_PROGRESS" as const },
    { title: "Improve dashboard query N+1 on assignees", description: "LatestIssues fires one query per assignee. Joining users in a single include.", status: "IN_PROGRESS" as const },
    { title: "Add rate limiting to issue creation API", description: "POST /api/issues has no throttle. Adding per-user sliding window to prevent duplicates.", status: "IN_PROGRESS" as const },
    { title: "Fix Vercel cold-start Prisma connection leak", description: "Serverless connections exhaust pool. Reusing global Prisma instance with adapter.", status: "IN_PROGRESS" as const },
    // 11x CLOSED
    { title: "Fix 404 on direct issue link when unauthenticated", description: "Direct links to /issues/[id] returned 404 instead of redirecting to login. Fixed with middleware redirect.", status: "CLOSED" as const },
    { title: "Correct seed script wiping users table", description: "Old seed called deleteMany on users as well as issues. Scoped to issues only.", status: "CLOSED" as const },
    { title: "Resolve double toast on issue update", description: "Success toast fired twice due to StrictMode double-effect. Guarded with ref.", status: "CLOSED" as const },
    { title: "Patch missing updatedAt sort order", description: "List defaulted to id order. Now orders by updatedAt desc.", status: "CLOSED" as const },
    { title: "Fix Google OAuth callback loop", description: "Callback looped when AUTH_SECRET mismatched between envs. Aligned env vars on Vercel.", status: "CLOSED" as const },
    { title: "Remove console noise in production build", description: "Stripped debug logs from issue form validation path.", status: "CLOSED" as const },
    { title: "Fix responsive overflow on issue table", description: "Table overflowed viewport under 640px. Wrapped in scroll container.", status: "CLOSED" as const },
    { title: "Close XSS via unsanitized avatar URL", description: "Avatar image accepted javascript: URLs. Now validated to https only.", status: "CLOSED" as const },
    { title: "Fix Sentry double-init on edge runtime", description: "Edge and node configs both initialized. Scoped init per runtime.", status: "CLOSED" as const },
    { title: "Correct README DATABASE_URL example", description: "Example lacked ssl-mode param for Aiven. Updated docs.", status: "CLOSED" as const },
    { title: "Fix stale nav active state on /issues/new", description: "Nav highlighted List instead of New. Matched pathname prefix correctly.", status: "CLOSED" as const },
  ];

  const result = await prisma.issue.createMany({ data });
  const counts = await prisma.issue.groupBy({ by: ["status"], _count: true });
  console.log(`Inserted ${result.count} issues`);
  console.log(counts);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
