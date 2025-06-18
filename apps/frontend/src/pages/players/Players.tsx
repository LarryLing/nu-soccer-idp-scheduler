import { Heading, Section, Text } from "@radix-ui/themes";
import type { Player } from "../../utils/types.ts";
import { DataTable } from "./DataTable.tsx";
import { columns } from "./Column.tsx";

const players: Player[] = [
    {
        id: "0",
        number: 0,
        name: "Dominic Pereira",
        position: "Goalkeeper",
        availability: [
            {
                day: "Monday",
                start: "8:00am",
                end: "10:30am",
            },
        ],
    },
    {
        id: "1",
        number: 1,
        name: "Rafael Ponce de Leon",
        position: "Goalkeeper",
        availability: [
            {
                day: "Friday",
                start: "6:30pm",
                end: "8:00pm",
            },
            {
                day: "Thursday",
                start: "7:00pm",
                end: "8:30pm",
            },
        ],
    },
    {
        id: "2",
        number: 2,
        name: "Brandon Clagette",
        position: "Defender",
        availability: [
            {
                day: "Tuesday",
                start: "7:00pm",
                end: "9:00pm",
            },
        ],
    },
];

export default function Players() {
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
