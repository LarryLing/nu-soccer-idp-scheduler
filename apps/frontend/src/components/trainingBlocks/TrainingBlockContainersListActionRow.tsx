import { Box, Button, Flex, Select } from "@radix-ui/themes";
import { DownloadIcon, Shuffle, TrashIcon, UploadIcon } from "lucide-react";
import type { TrainingBlock } from "../../utils/types.ts";
import { type ChangeEvent, useRef, useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import AddTrainingBlockDialog from "./AddTrainingBlockDialog.tsx";
import { DAYS } from "../../utils/constants.ts";
import { TrainingBlockSchema } from "../../utils/schemas.ts";
import z from "zod";

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

  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const TrainingBlockImportSchema = z
    .object({
      id: z.string(),
      assignedPlayers: z.array(z.string()),
      createdAt: z.number(),
    })
    .and(TrainingBlockSchema);

  const validateTrainingBlockData = (
    data: unknown,
  ): data is TrainingBlock[] => {
    if (!Array.isArray(data)) return false;

    return data.every((item) => {
      const result = TrainingBlockImportSchema.safeParse(item);
      return result.success;
    });
  };

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
              createdAt: parsedTrainingBlock.createdAt,
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

  const handleClearAssignments = async () => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    const batch = writeBatch(clientFirestore);

    trainingBlocks.forEach((block) => {
      batch.update(
        doc(clientFirestore, `users/${user.uid}/trainingBlocks/${block.id}`),
        {
          assignedPlayers: [],
        },
      );
    });

    await batch.commit();
  };

  const handleAutoAssign = () => {
    // TODO: Implement auto-assignment logic
    console.log("Auto assign functionality not yet implemented");
  };

  return (
    <Flex
      direction={{ initial: "column", sm: "row" }}
      justify="between"
      align={{ initial: "start", sm: "center" }}
      gap={{ initial: "4", sm: "0" }}
      mb="4"
    >
      <ActionButtons
        trainingBlocks={trainingBlocks}
        onExport={exportJSON}
        onImport={handleImportClick}
        onAutoAssign={handleAutoAssign}
        onClearAssignments={handleClearAssignments}
        isImporting={isImporting}
      />
      <DayFilter dayFilter={dayFilter} onDayFilterChange={setDayFilter} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={importJSON}
        style={{ display: "none" }}
        aria-label="Import JSON file"
      />
    </Flex>
  );
}

const ActionButtons = ({
  trainingBlocks,
  onExport,
  onImport,
  onAutoAssign,
  onClearAssignments,
  isImporting,
}: {
  trainingBlocks: TrainingBlock[];
  onExport: () => void;
  onImport: () => void;
  onAutoAssign: () => void;
  onClearAssignments: () => void;
  isImporting: boolean;
}) => {
  const isPlayerAssigned = trainingBlocks.some(
    (block) => block.assignedPlayers.length > 0,
  );

  return (
    <Flex align="center" gap="2" wrap="wrap">
      <AddTrainingBlockDialog
        user={useUser().user}
        trainingBlocks={trainingBlocks}
      />
      <Button variant="outline" onClick={onExport}>
        <DownloadIcon size={15} />
        Export JSON
      </Button>
      <Button variant="outline" onClick={onImport} disabled={isImporting}>
        <UploadIcon size={15} />
        {isImporting ? "Importing..." : "Import JSON"}
      </Button>
      <Button variant="outline" onClick={onAutoAssign}>
        <Shuffle size={15} />
        Auto Assign
      </Button>
      {isPlayerAssigned && (
        <Button variant="outline" color="red" onClick={onClearAssignments}>
          <TrashIcon size={15} />
          Clear Assignments
        </Button>
      )}
    </Flex>
  );
};

const DayFilter = ({
  dayFilter,
  onDayFilterChange,
}: {
  dayFilter: string;
  onDayFilterChange: (value: string) => void;
}) => (
  <Box width="125px">
    <Select.Root value={dayFilter} onValueChange={onDayFilterChange}>
      <Select.Trigger style={{ width: "100%" }} />
      <Select.Content>
        <Select.Item value="All">All Days</Select.Item>
        {DAYS.map((day) => (
          <Select.Item key={day} value={day}>
            {day}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  </Box>
);
