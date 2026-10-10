import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.issue.deleteMany({});

  await prisma.issue.createMany({
    data: [
      {
        title: "Login page returns 500 on expired session",
        description:
          "When a session token expires while the login form is open, submitting returns a 500 instead of redirecting to re-authenticate. Expected: graceful redirect with a 'session expired' notice.",
        status: "OPEN",
        createdAt: new Date("2026-09-01T09:12:00Z"),
        updatedAt: new Date("2026-09-01T09:12:00Z"),
      },
      {
        title: "Dashboard charts flicker on filter change",
        description:
          "Switching the date-range filter on the dashboard causes all charts to unmount and remount, producing a visible flicker. Expected: smooth transition with skeleton placeholders.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-02T14:30:00Z"),
        updatedAt: new Date("2026-09-04T10:05:00Z"),
      },
      {
        title: "Password reset email never arrives",
        description:
          "Users requesting a password reset never receive the email, though the UI shows a success message. Checked spam and mail logs — no outbound message recorded. Likely a broken queue job.",
        status: "OPEN",
        createdAt: new Date("2026-09-04T08:45:00Z"),
        updatedAt: new Date("2026-09-04T11:20:00Z"),
      },
      {
        title: "Mobile navbar overlaps hero CTA",
        description:
          "On viewports under 390px the sticky navbar covers the hero call-to-action button, making it untappable. Reproduced on iPhone 12 Safari and Chrome mobile emulation.",
        status: "CLOSED",
        createdAt: new Date("2026-09-05T16:00:00Z"),
        updatedAt: new Date("2026-09-09T13:40:00Z"),
      },
      {
        title: "CSV export truncates descriptions over 255 chars",
        description:
          "Exporting issues to CSV silently cuts the description column at 255 characters with no warning. Expected: full text export or an explicit truncation notice.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-07T10:15:00Z"),
        updatedAt: new Date("2026-09-08T15:55:00Z"),
      },
      {
        title: "Search is case-sensitive for issue titles",
        description:
          "Searching 'login' does not match an issue titled 'Login fails on Safari'. Search should be case-insensitive across title and description.",
        status: "CLOSED",
        createdAt: new Date("2026-09-08T12:00:00Z"),
        updatedAt: new Date("2026-09-12T09:30:00Z"),
      },
      {
        title: "Avatar upload accepts non-image files",
        description:
          "Uploading a .pdf as a profile avatar passes client validation and then fails with an unhandled server error. Expected: client-side file-type rejection with a clear message.",
        status: "OPEN",
        createdAt: new Date("2026-09-10T09:40:00Z"),
        updatedAt: new Date("2026-09-10T09:40:00Z"),
      },
      {
        title: "Pagination resets to page 1 after editing an issue",
        description:
          "On page 3 of the issue list, editing and saving an issue returns the user to page 1 instead of preserving their position. Expected: stay on the current page.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-11T15:25:00Z"),
        updatedAt: new Date("2026-09-13T11:10:00Z"),
      },
      {
        title: "Dark mode contrast fails on status badges",
        description:
          "In dark mode the IN_PROGRESS badge (yellow on white) has a contrast ratio below 3:1 and is unreadable. Needs a darker badge background per WCAG AA.",
        status: "OPEN",
        createdAt: new Date("2026-09-13T18:05:00Z"),
        updatedAt: new Date("2026-09-14T08:00:00Z"),
      },
      {
        title: "Duplicate issue created on double-click",
        description:
          "Double-clicking the 'New Issue' submit button creates two identical records. The button is not disabled while the request is in flight.",
        status: "CLOSED",
        createdAt: new Date("2026-09-15T07:50:00Z"),
        updatedAt: new Date("2026-09-18T16:20:00Z"),
      },
      {
        title: "Email notifications sent twice for assignments",
        description:
          "Assignees receive two identical 'you were assigned' emails a minute apart. Suspect the notification hook fires on both create and update paths.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-17T13:35:00Z"),
        updatedAt: new Date("2026-09-19T09:45:00Z"),
      },
      {
        title: "Issue detail page slow with long comment threads",
        description:
          "Issues with 100+ comments take over 4s to load and freeze scrolling. Likely no pagination or virtualization on the comment list.",
        status: "OPEN",
        createdAt: new Date("2026-09-19T11:00:00Z"),
        updatedAt: new Date("2026-09-19T11:00:00Z"),
      },
      {
        title: "Timezone shifts due dates by one day",
        description:
          "A due date of Oct 5 picked in GMT+5 renders as Oct 4 for users in GMT-4. Dates are stored as midnight UTC without preserving the reporter's timezone.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-21T16:45:00Z"),
        updatedAt: new Date("2026-09-23T10:30:00Z"),
      },
      {
        title: "Markdown preview does not escape script tags",
        description:
          "Pasting <script>alert(1)</script> into an issue description executes in the preview pane. This is a stored-XSS risk and must be sanitized.",
        status: "CLOSED",
        createdAt: new Date("2026-09-23T09:20:00Z"),
        updatedAt: new Date("2026-09-27T14:00:00Z"),
      },
      {
        title: "Filter by assignee returns unassigned issues too",
        description:
          "Selecting an assignee in the filter dropdown still lists issues with no assignee. The query appears to use OR instead of AND with the status filter.",
        status: "OPEN",
        createdAt: new Date("2026-09-25T14:10:00Z"),
        updatedAt: new Date("2026-09-26T09:05:00Z"),
      },
      {
        title: "Session expires without warning during long edits",
        description:
          "Writing a long issue description for 30+ minutes then saving fails silently because the session expired. Expected: a warning modal and draft preservation.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-09-27T10:55:00Z"),
        updatedAt: new Date("2026-09-29T12:25:00Z"),
      },
      {
        title: "Sorting by updatedAt ignores time component",
        description:
          "Sorting the list by 'recently updated' only compares calendar dates, so issues updated hours apart appear in insertion order. Should sort by full timestamp.",
        status: "CLOSED",
        createdAt: new Date("2026-09-29T08:30:00Z"),
        updatedAt: new Date("2026-10-03T17:15:00Z"),
      },
      {
        title: "OAuth login fails when email is already registered",
        description:
          "Signing in with Google using an email that already exists via credentials throws 'Account already exists' with no recovery path. Expected: account-linking prompt.",
        status: "OPEN",
        createdAt: new Date("2026-10-01T12:40:00Z"),
        updatedAt: new Date("2026-10-01T12:40:00Z"),
      },
      {
        title: "Attachment download returns 404 after 24 hours",
        description:
          "Uploaded attachments download fine initially but return 404 the next day. Suspect signed URLs expire and the stored link is not refreshed on render.",
        status: "IN_PROGRESS",
        createdAt: new Date("2026-10-05T15:00:00Z"),
        updatedAt: new Date("2026-10-07T09:20:00Z"),
      },
      {
        title: "Closed issues still appear in 'My open work' widget",
        description:
          "The dashboard 'My open work' widget counts CLOSED issues assigned to the user. Filter is missing the status constraint; should exclude CLOSED.",
        status: "CLOSED",
        createdAt: new Date("2026-10-08T09:15:00Z"),
        updatedAt: new Date("2026-10-09T18:45:00Z"),
      },
    ],
  });

  const count = await prisma.issue.count();
  console.log(`Seeded ${count} issues`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
