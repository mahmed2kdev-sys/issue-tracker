import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";

export default function DeleteIssueButton() {
  return (
    <Button color="red">
      <TrashIcon /> Delete Issue
    </Button>
  );
}
