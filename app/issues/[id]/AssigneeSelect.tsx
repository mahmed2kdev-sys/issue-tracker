"use client";

import Skeleton from "@/app/components/Skeleton";
import { User } from "@/generated/prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AssigneeSelect() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  if (isLoading) return <Skeleton height="2rem" />;
  if (error || !users)
    return (
      <Select.Root disabled>
        <Select.Trigger placeholder="Assign…" />
      </Select.Root>
    );

  return (
    <Select.Root>
      <Select.Trigger placeholder="Assign…" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Assign to</Select.Label>
          {users.map((u) => (
            <Select.Item key={u.id} value={u.id}>
              {u.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
