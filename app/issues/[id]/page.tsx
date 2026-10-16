import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { cache } from "react";
import DeleteIssueButton from "./DeleteIssueButton";
import EditIssueButton from "./EditIssueButton";
import AssigneeSelect from "./AssigneeSelect";
import StatusSelect from "./StatusSelect";
import IssueDetails from "./IssueDetails";
import { auth } from "@/app/auth/authOptions";

interface Props {
  params: Promise<{ id: string }>;
}

const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);

export default async function IssueDetailPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) notFound();

  const issue = await fetchIssue(issueId);
  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <StatusSelect issue={issue} />
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) return { title: "Issue Details" };

  const issue = await fetchIssue(issueId);
  if (!issue) return { title: "Issue Details" };

  return {
    title: issue.title,
    description: `Details for issue ${issue.id}`,
  };
}
