"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Box, DropdownMenu, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/app/components";

export default function AuthStatus() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <Box>
      {status === "loading" && <Skeleton width="3rem" />}
      {status === "authenticated" && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button
              aria-label="Account menu"
              className="cursor-pointer rounded-full"
            >
              <Avatar
                src={session.user?.image ?? undefined}
                fallback={(session.user?.email?.[0] ?? "?").toUpperCase()}
                size="2"
                radius="full"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>
              <Text size="2">{session.user!.email}</Text>
            </DropdownMenu.Label>
            <DropdownMenu.Item asChild>
              <Link
                href={`/api/auth/signout?callbackUrl=${encodeURIComponent("/?toast=logged-out")}`}
              >
                Log out
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}

      {status === "unauthenticated" && (
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`${pathname}?toast=logged-in`)}`}
          className="nav-link"
        >
          Log in
        </Link>
      )}
    </Box>
  );
}
