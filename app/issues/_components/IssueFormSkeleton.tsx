import { Skeleton } from "@/app/components";
import { Box, Flex } from "@radix-ui/themes";

export default function IssueFormSkeleton() {
  return (
    <Box className="max-w-xl space-y-3">
      <Skeleton height="2.25rem" />
      <Skeleton height={300} />
      <Flex gap="3">
        <Skeleton width="8rem" height="2.5rem" />
        <Skeleton width="6rem" height="2.5rem" />
      </Flex>
    </Box>
  );
}
