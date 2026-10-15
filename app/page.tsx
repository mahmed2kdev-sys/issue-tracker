import IssueChart from "./IssueChart";
import IssueSummary from "./IssueSummary";
import LatestIssues from "@/app/LatestIssues";
import { prisma } from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [open, inProgress, closed] = await Promise.all(
    (["OPEN", "IN_PROGRESS", "CLOSED"] as const).map((status) =>
      prisma.issue.count({ where: { status } }),
    ),
  );

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="4">
      <Flex direction="column" gap="4">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "A simple issue tracker built with Next.js and Prisma.",
};
