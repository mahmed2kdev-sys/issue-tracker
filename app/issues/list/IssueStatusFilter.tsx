"use client";

import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const statuses = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
] as const;

export default function IssueStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "ALL";

  return (
    <Select.Root
      value={status}
      onValueChange={(status) => {
        const params = new URLSearchParams(searchParams);
        if (status === "ALL") params.delete("status");
        else params.set("status", status);
        const query = params.size ? `?${params.toString()}` : "";
        router.push(`/issues/list${query}`);
      }}
    >
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((s) => (
          <Select.Item key={s.value} value={s.value}>
            {s.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
