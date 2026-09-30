import { IssueStatusBadge } from "@/app/components";
import prisma from "@/prisma/client";
import { Card, Flex, Heading, Text, Box, Grid, Button } from "@radix-ui/themes";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box className="space-y-3">
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
      </Box>
      <Box>
        <Button asChild>
          <Link href={`/issues/${issue.id}/edit`}>
            <Pencil2Icon /> Edit Issue
          </Link>
        </Button>
      </Box>
    </Grid>
  );
}
