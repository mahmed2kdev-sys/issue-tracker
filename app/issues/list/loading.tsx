import IssueActions from "@/app/issues/list/IssueActions";
import { Skeleton } from "@/app/components";
import { Table } from "@radix-ui/themes";

export default function LoadingIssuesPage() {
  const rows = [1, 2, 3, 4, 5];

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created At
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row}>
              <Table.Cell>
                <Skeleton />
                <div className="md:hidden">
                  <Skeleton width="4rem" />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton width="4rem" />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton width="6rem" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
