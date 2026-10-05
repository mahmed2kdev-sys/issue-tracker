"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/issues", label: "Issues" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex space-x-6">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={classNames("transition-colors hover:text-gray-800", {
              "font-semibold": pathname === href,
              "text-gray-500": pathname !== href,
            })}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
