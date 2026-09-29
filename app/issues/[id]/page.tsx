import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import prisma from "@/prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) return { title: "Issue Details" };

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!issue) return { title: "Issue Details" };

  return {
    title: issue.title,
    description: `Details for issue ${issue.id}`,
  };
}

export default async function IssueDetailPage({ params }: Props) {
  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) notFound();

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!issue) notFound();

  return (
    <div className="max-w-xl space-y-3">
      <Heading>{issue.title}</Heading>
      <Flex gap="3" align="center">
        <IssueStatusBadge status={issue.status} />
        <Text size="2" color="gray">
          {issue.createdAt.toDateString()}
        </Text>
      </Flex>
      <Card className="prose">
        <ReactMarkdown>{issue.description ?? ""}</ReactMarkdown>
      </Card>
    </div>
  );
}
