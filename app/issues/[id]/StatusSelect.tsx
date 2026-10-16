"use client";

import type { Issue } from "@/generated/prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { statuses, type IssueStatusValue } from "../statuses";

export default function StatusSelect({ issue }: { issue: Issue }) {
  const router = useRouter();

  const changeStatus = async (status: IssueStatusValue) => {
    try {
      await axios.patch(`/api/issues/${issue.id}`, { status });
      toast.success("Status updated.");
      router.refresh();
    } catch {
      toast.error("Changes could not be saved.");
    }
  };

  return (
    <Select.Root key={issue.status} defaultValue={issue.status} onValueChange={changeStatus}>
      <Select.Trigger placeholder="Status…" />
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
