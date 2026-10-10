import { Button } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "./IssueStatusFilter";

export default function IssueActions() {
  return (
    <div className="mb-5 flex justify-between">
      <IssueStatusFilter />
      <Button size="3">
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
}
