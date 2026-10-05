import Link from "next/link";
import { FaBug } from "react-icons/fa";
import { Container, Flex } from "@radix-ui/themes";
import NavLinks from "./NavLinks";
import AuthStatus from "./auth/AuthStatus";

export default function NavBar() {
  return (
    <nav className="border-b border-gray-300 mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/" aria-label="Home">
              <FaBug />
            </Link>
            <NavLinks />
          </Flex>
          <AuthStatus />
        </Flex>
      </Container>
    </nav>
  );
}
