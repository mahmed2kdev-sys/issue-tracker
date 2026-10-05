"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBug } from "react-icons/fa";
import classNames from "classnames";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/app/components";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/issues", label: "Issues" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-gray-300 mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/" aria-label="Home">
              <FaBug />
            </Link>
            <ul className="flex space-x-6">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={classNames(
                      "transition-colors hover:text-gray-800",
                      {
                        "font-semibold": pathname === href,
                        "text-gray-500": pathname !== href,
                      },
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Flex>
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
                    <Link href="/api/auth/signout">Log out</Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}

            {status === "unauthenticated" && (
              <Link
                href="/api/auth/signin"
                className="text-gray-500 transition-colors hover:text-gray-800"
              >
                Log in
              </Link>
            )}
          </Box>
        </Flex>
      </Container>
    </nav>
  );
}
