import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Status } from "@/generated/prisma/client";
import IssueActions from "./IssueActions";
import IssueTable, { IssueQuery, columnNames } from "./IssueTable";

interface IssuesPageProps {
  searchParams: Promise<IssueQuery>;
}

async function IssuesPage({ searchParams }: IssuesPageProps) {
  const params = await searchParams;
  const status = Object.values(Status).includes(params.status)
    ? params.status
    : undefined;
  const where = status ? { status } : undefined;

  const orderBy = (columnNames as string[]).includes(params.orderBy)
    ? { [params.orderBy]: "asc" as const }
    : undefined;

  const pageSize = 10;
  const currentPage = Math.max(1, parseInt(params.page) || 1);
  const issueCount = await prisma.issue.count({ where });
  const pageCount = Math.max(1, Math.ceil(issueCount / pageSize));

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div>
      <IssueActions />
      <IssueTable searchParams={params} issues={issues} />
      <Pagination page={currentPage} pageCount={pageCount} />
    </div>
  );
}
export const dynamic = "force-dynamic";
export default IssuesPage;
