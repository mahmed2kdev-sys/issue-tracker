import IssueSummary from "./IssueSummary";
import LatestIssues from "@/app/LatestIssues";
import { prisma } from "@/prisma/client";
import { Flex } from "@radix-ui/themes";

export default async function Home() {
  const [open, inProgress, closed] = await Promise.all(
    (["OPEN", "IN_PROGRESS", "CLOSED"] as const).map((status) =>
      prisma.issue.count({ where: { status } })
    )
  );

  return (
    <Flex direction="column" gap="4">
      <IssueSummary open={open} inProgress={inProgress} closed={closed} />
      <LatestIssues />
    </Flex>
  );
}