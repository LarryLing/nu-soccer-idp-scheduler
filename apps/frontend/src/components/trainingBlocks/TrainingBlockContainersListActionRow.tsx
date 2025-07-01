import { Box, Button, Flex, Select } from "@radix-ui/themes";
import { DownloadIcon, Shuffle, UploadIcon } from "lucide-react";
import type { TrainingBlock } from "../../utils/types.ts";
import { type ChangeEvent, useRef, useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import AddTrainingBlockDialog from "./AddTrainingBlockDialog.tsx";
import { DAYS } from "../../utils/constants.ts";

type TrainingBlocksContainersListActionRowProps = {
  trainingBlocks: TrainingBlock[];
  dayFilter: string;
  setDayFilter: (dayFilter: string) => void;
};

export default function TrainingBlocksContainersListActionRow({
  trainingBlocks,
  dayFilter,
  setDayFilter,
}: TrainingBlocksContainersListActionRowProps) {
  const { user } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isImporting, setIsImporting] = useState(false);

  const exportJSON = () => {
    try {
      const jsonData = new Blob([JSON.stringify(trainingBlocks, null, 2)], {
        type: "application/json",
      });

      const jsonURL = URL.createObjectURL(jsonData);
      const link = document.createElement("a");

      link.href = jsonURL;
      link.download = `training_blocks_${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      setTimeout(() => URL.revokeObjectURL(jsonURL), 100);
    } catch (error) {
      console.error("Failed to export JSON:", error);
    }
  };

  const validateTrainingBlockData = (
    data: unknown,
  ): data is TrainingBlock[] => {
    if (!Array.isArray(data)) return false;

    return data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "day" in item &&
        "start" in item &&
        "end" in item &&
        "assignedPlayers" in item,
    );
  };

  const importJSON = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("json")) {
      console.error("Invalid file type. Please select a JSON file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error("File too large. Maximum size is 10MB.");
      return;
    }

    setIsImporting(true);

    try {
      const text = await file.text();
      const parsedTrainingBlocks = JSON.parse(text);

      if (!validateTrainingBlockData(parsedTrainingBlocks)) {
        throw new Error("Invalid training block data format");
      }

      const batch = writeBatch(clientFirestore);

      trainingBlocks.forEach((trainingBlock) => {
        if (trainingBlock.id) {
          batch.delete(
            doc(
              clientFirestore,
              `users/${user.uid}/trainingBlocks/${trainingBlock.id}`,
            ),
          );
        }
      });

      parsedTrainingBlocks.forEach((parsedTrainingBlock) => {
        if (parsedTrainingBlock.id) {
          batch.set(
            doc(
              clientFirestore,
              `users/${user.uid}/trainingBlocks/${parsedTrainingBlock.id}`,
            ),
            {
              day: parsedTrainingBlock.day,
              start: parsedTrainingBlock.start,
              end: parsedTrainingBlock.end,
              assignedPlayers: parsedTrainingBlock.assignedPlayers,
            },
          );
        }
      });

      await batch.commit();
    } catch (error) {
      console.error("Failed to import JSON:", error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Flex
      direction={{ initial: "column", sm: "row" }}
      justify="between"
      align={{ initial: "start", sm: "center" }}
      gap={{ initial: "4", sm: "0" }}
      mb="4"
    >
      <Flex align="center" gap="2" wrap="wrap">
        <AddTrainingBlockDialog user={user} trainingBlocks={trainingBlocks} />
        <Button variant="outline" onClick={exportJSON}>
          <DownloadIcon size={15} />
          Export JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={importJSON}
          style={{ display: "none" }}
          aria-label="Import JSON file"
        />
        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isImporting}
        >
          <UploadIcon size={15} />
          {isImporting ? "Importing..." : "Import JSON"}
        </Button>
        <Button variant="outline">
          <Shuffle size={15} />
          Auto Assign
        </Button>
      </Flex>
      <Box width="125px">
        <Select.Root value={dayFilter} onValueChange={setDayFilter}>
          <Select.Trigger style={{ width: "100%" }} />
          <Select.Content>
            <Select.Item value="All">All Days</Select.Item>
            {DAYS.map((position) => (
              <Select.Item key={position} value={position}>
                {position}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Box>
    </Flex>
  );
}
