"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
            className={pathname === href ? "nav-link nav-link-active" : "nav-link"}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
