"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBug } from "react-icons/fa";
import classNames from "classnames";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/issues", label: "Issues" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-300">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" aria-label="Home">
          <FaBug />
        </Link>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={classNames("transition-colors hover:text-gray-800", {
              "font-semibold": pathname === href,
              "text-gray-500": pathname !== href,
            })}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
