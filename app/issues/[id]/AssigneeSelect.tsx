"use client";

import Skeleton from "@/app/components/Skeleton";
import { Issue, User } from "@/generated/prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function AssigneeSelect({ issue }: { issue: Issue }) {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3, // retry once on failure
  });

  if (isLoading) return <Skeleton height="2rem" />;
  if (error || !users)
    return (
      <Select.Root disabled>
        <Select.Trigger placeholder="Assign…" />
      </Select.Root>
    );

  const assignIssue = async (userId: string) => {
    try {
      await axios.patch(`/api/issues/${issue.id}`, {
        assignedToUserId: userId === "unassigned" ? null : userId,
      });
      toast.success("Assignee updated.");
    } catch {
      toast.error("Changes could not be saved.");
    }
  };

  return (
    <Select.Root
      defaultValue={issue.assignedToUserId ?? "unassigned"}
      onValueChange={assignIssue}
    >
      <Select.Trigger placeholder="Assign…" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Assign to</Select.Label>
          <Select.Item value="unassigned">Unassigned</Select.Item>
          {users.map((u) => (
            <Select.Item key={u.id} value={u.id}>
              {u.name || u.email}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
