import { Button } from "@radix-ui/themes";
import Link from "next/link";

function IssuesPages() {
  return (
    <div>
      <Button size="3">
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
}

export default IssuesPages;
