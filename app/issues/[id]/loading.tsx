import { Card, Flex } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingIssueDetailPage() {
  return (
    <div className="max-w-xl space-y-3">
      <Skeleton height="2rem" width="60%" />
      <Flex gap="3" align="center">
        <Skeleton width="4rem" />
        <Skeleton width="6rem" />
      </Flex>
      <Card>
        <Skeleton count={5} />
      </Card>
    </div>
  );
}
