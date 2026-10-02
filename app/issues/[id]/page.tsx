import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import DeleteIssueButton from "./DeleteIssueButton";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";

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
    <Grid columns={{ initial: "1", md: "5" }} gap="5">
      <Box className="lg:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      <Box>
        <Flex direction="column" gap="4">
          <EditIssueButton issueId={issue.id} />
          <DeleteIssueButton />
        </Flex>
      </Box>
    </Grid>
  );
}
