import { Skeleton } from "@/app/components";
import { Box, Card, Flex } from "@radix-ui/themes";

export default function RegisterLoading() {
  return (
    <Flex justify="center">
      <Card className="w-full max-w-md p-6">
        <Box className="space-y-3">
          <Skeleton height="1.75rem" width="8rem" />
          <Skeleton height="2.25rem" />
          <Skeleton height="2.25rem" />
          <Skeleton height="2.25rem" />
          <Skeleton height="2.5rem" />
          <Skeleton height="2.5rem" />
        </Box>
      </Card>
    </Flex>
  );
}
