import IssueActions from "@/app/issues/list/IssueActions";
import { IssueStatusBadge, Link } from "@/app/components";
import prisma from "@/prisma/client";
import { Issue, Status } from "@/generated/prisma/client";
import { Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface IssuesPageProps {
  searchParams: Promise<{ status: Status; orderBy: keyof Issue }>;
}

async function IssuesPage({ searchParams }: IssuesPageProps) {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Title", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];
  const { status, orderBy } = await searchParams;
  const isValidStatus = Object.values(Status).includes(status);
  const isValidOrderBy = columns.map((c) => c.value).includes(orderBy);

  const issues = await prisma.issue.findMany({
    where: isValidStatus ? { status } : undefined,
    orderBy: isValidOrderBy ? { [orderBy]: "asc" } : undefined,
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
                  href={{
                    query: { status, orderBy: column.value },
                  }}
                >
                  {column.label}
                </NextLink>
                {orderBy === column.value && <ArrowUpIcon className="inline" />}
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
