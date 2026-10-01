"use client";

import dynamic from "next/dynamic";
import type { Issue } from "@/generated/prisma/client";
import IssueFormSkeleton from "./IssueFormSkeleton";

const IssueForm = dynamic(() => import("./IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

export default function DynamicIssueForm({ issue }: { issue?: Issue }) {
  return <IssueForm issue={issue} />;
}
