import { Skeleton } from "@/app/components";
import { auth } from "@/app/auth/authOptions";
import { Box, Card, Flex, Grid } from "@radix-ui/themes";

export default async function LoadingIssueDetailPage() {
  const session = await auth();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <Skeleton />
        <Flex gap="3" align="center" my="2">
          <Skeleton width="5rem" />
          <Skeleton width="8rem" />
        </Flex>
        <Card className="prose max-w-full" mt="4">
          <Skeleton count={3} />
        </Card>
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <Skeleton height="2rem" />
            <Skeleton height="2rem" />
            <Skeleton height="2rem" />
          </Flex>
        </Box>
      )}
    </Grid>
  );
}
