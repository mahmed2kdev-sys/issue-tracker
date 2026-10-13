import { Link } from "@/app/components";
import { Card, Flex, Text } from "@radix-ui/themes";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

export default function IssueSummary({ open, inProgress, closed }: Props) {
  const cards = [
    { label: "Open", value: open, href: "/issues/list?status=OPEN" },
    {
      label: "In Progress",
      value: inProgress,
      href: "/issues/list?status=IN_PROGRESS",
    },
    { label: "Closed", value: closed, href: "/issues/list?status=CLOSED" },
  ];

  return (
    <Flex gap="4">
      {cards.map((card) => (
        <Card key={card.label}>
          <Flex direction="column" gap="1">
            <Link href={card.href}>{card.label}</Link>
            <Text size="5" weight="bold">
              {card.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
