import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import DynamicIssueForm from "../../_components/DynamicIssueForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditIssuePage({ params }: Props) {
  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) notFound();

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!issue) notFound();

  return <DynamicIssueForm issue={issue} />;
}
