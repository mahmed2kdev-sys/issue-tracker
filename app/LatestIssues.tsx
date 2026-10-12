import { IssueStatusBadge, Link } from "@/app/components";
import { prisma } from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";

export default async function LatestIssues() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { assignedToUser: true },
  });

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Heading size="4">Latest Issues</Heading>
        <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex direction="column" align="start" gap="1">
                  <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                  <IssueStatusBadge status={issue.status} />
                </Flex>
              </Table.Cell>
              <Table.Cell>
                {issue.assignedToUser && (
                  <Avatar
                    src={issue.assignedToUser.image ?? undefined}
                    fallback={issue.assignedToUser.email[0].toUpperCase()}
                    size="2"
                    radius="full"
                  />
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      </Flex>
    </Card>
  );
}