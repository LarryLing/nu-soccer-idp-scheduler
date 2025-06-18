import {
    Box,
    Button,
    Flex,
    Heading,
    Section,
    Separator,
    Text,
    TextField,
} from "@radix-ui/themes";
import {
    DownloadIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    TrashIcon,
    UploadIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
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
    const [selectedPlayers, setSelectedPlayers] = useState([]);

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
                <Flex justify="between" align="center">
                    <Flex align="center" gap="3">
                        <Button>
                            <PlusIcon />
                            Add Player
                        </Button>
                        <Button variant="outline">
                            <DownloadIcon />
                            Export JSON
                        </Button>
                        <Button variant="outline">
                            <UploadIcon />
                            Import JSON
                        </Button>
                        {selectedPlayers.length > 0 && (
                            <>
                                <Separator size="2" orientation="vertical" />
                                <Text>
                                    {`${selectedPlayers.length} selected`}
                                </Text>
                                <Button color="red">
                                    <TrashIcon />
                                    Delete JSON
                                </Button>
                            </>
                        )}
                    </Flex>
                    <Box width="250px" maxWidth="250px">
                        <TextField.Root
                            id="search"
                            name="search"
                            placeholder="Search players by name..."
                        >
                            <TextField.Slot>
                                <MagnifyingGlassIcon />
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>
                </Flex>
            </Section>
            <Section p="0">
                <DataTable columns={columns} data={players} />
            </Section>
        </>
    );
}
