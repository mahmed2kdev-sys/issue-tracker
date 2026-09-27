import { PropsWithChildren } from "react";
import { Text } from "@radix-ui/themes";

export default function ErrorMessage({ children }: PropsWithChildren) {
  if (!children) return null;
  return (
    <Text color="red" size="2" as="p" className="block pb-2">
      {children}
    </Text>
  );
}
