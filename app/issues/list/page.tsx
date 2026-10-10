import IssueActions from "@/app/issues/list/IssueActions";
import { IssueStatusBadge, Link } from "@/app/components";
import prisma from "@/prisma/client";
import { Status } from "@/generated/prisma/client";
import { Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const columns = [
  { label: "Title", value: "title", className: undefined },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
] as const;

type OrderBy = (typeof columns)[number]["value"];

async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; orderBy?: string }>;
}) {
  const { status, orderBy } = await searchParams;
  const isValidStatus = Object.values(Status).includes(status as Status);
  const isValidOrderBy = columns
    .map((c) => c.value)
    .includes(orderBy as OrderBy);

  const issues = await prisma.issue.findMany({
    where: isValidStatus ? { status: status as Status } : undefined,
    orderBy: isValidOrderBy ? { [orderBy as OrderBy]: "asc" } : undefined,
  });

  return (
    <div>
      <IssueActions />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={`/issues/list?${new URLSearchParams({
                    ...(status ? { status } : {}),
                    orderBy: column.value,
                  })}`}
                >
                  {column.label}
                </NextLink>
                {orderBy === column.value && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
export const dynamic = "force-dynamic";
export default IssuesPage;
