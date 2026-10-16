// ponytail: literal array (not a value import of the Prisma enum) keeps the
// generated client out of the client bundle; IssueForm imports this via schema.
export const issueStatus = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;

export type IssueStatusValue = (typeof issueStatus)[number];

export const statuses: { label: string; value: IssueStatusValue }[] = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];
