import { Skeleton } from "@/app/components";
import { Box } from "@radix-ui/themes";

export default function LoadingNewIssuePage() {
  return (
    <Box className="max-w-xl space-y-3">
      <Skeleton height="2.25rem" />
      <Skeleton height={300} />
      <Skeleton width="10rem" height="2.5rem" />
    </Box>
  );
}
