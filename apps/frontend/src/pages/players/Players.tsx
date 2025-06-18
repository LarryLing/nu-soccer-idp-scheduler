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
        </>
    );
}
