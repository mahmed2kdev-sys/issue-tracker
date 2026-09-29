import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
}

export default function Link({ href, children }: Props) {
  return (
    <RadixLink asChild>
      <NextLink href={href}>{children}</NextLink>
    </RadixLink>
  );
}
