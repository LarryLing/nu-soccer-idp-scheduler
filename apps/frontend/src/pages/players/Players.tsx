import { Heading, Section, Text } from "@radix-ui/themes";
import { DataTable } from "./DataTable.tsx";
import { columns } from "./Column.tsx";
import { usePlayers } from "../../hooks/usePlayers.ts";

export default function Players() {
    const { players } = usePlayers();

    return (
        <>
            <Section p="0">
                <Heading size="9" mb="3">
                    Manage Players
                </Heading>
                <Text size="3" weight="medium">
                    Add, remove, or edit player information
                </Text>
            </Section>
            <Section p="0">
                <DataTable columns={columns} data={players} />
            </Section>
        </>
    );
}
