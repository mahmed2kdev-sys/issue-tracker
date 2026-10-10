"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (pageCount <= 1) return null;

  const go = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Flex align="center" gap="2" mt="4">
      <Button variant="soft" disabled={page <= 1} onClick={() => go(1)}>
        First
      </Button>
      <Button variant="soft" disabled={page <= 1} onClick={() => go(page - 1)}>
        Prev
      </Button>
      <Text size="2">
        Page {page} of {pageCount}
      </Text>
      <Button
        variant="soft"
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        Next
      </Button>
      <Button
        variant="soft"
        disabled={page >= pageCount}
        onClick={() => go(pageCount)}
      >
        Last
      </Button>
    </Flex>
  );
}
