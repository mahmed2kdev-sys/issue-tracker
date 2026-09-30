import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

export default function EditIssueButton({ issueId }: { issueId: number }) {
  return (
    <Button asChild>
      <Link href={`/issues/${issueId}/edit`}>
        <Pencil2Icon /> Edit Issue
      </Link>
    </Button>
  );
}
