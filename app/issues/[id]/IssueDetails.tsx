import { IssueStatusBadge } from "@/app/components";
import type { Issue } from "@/generated/prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

export default function IssueDetails({ issue }: { issue: Issue }) {
  return (
    <div className="space-y-3">
      <Heading>{issue.title}</Heading>
      <Flex gap="3" align="center" my="2">
        <IssueStatusBadge status={issue.status} />
        <Text size="2" color="gray">
          {issue.createdAt.toDateString()}
        </Text>
      </Flex>
      <Card className="prose" mt="4">
        <ReactMarkdown>{issue.description ?? ""}</ReactMarkdown>
      </Card>
    </div>
  );
}
