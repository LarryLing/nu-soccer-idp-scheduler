import type {
  ContainerItem,
  Player,
  TrainingBlock,
} from "../../utils/types.ts";
import { Badge, Box, Flex, Text } from "@radix-ui/themes";
import { useEditTrainingBlockDialog } from "../../hooks/useEditTrainingBlockDialog.tsx";
import EditTrainingBlockDialog from "./EditTrainingBlockDialog.tsx";
import { DAYS } from "../../utils/constants.ts";
import { parseTime } from "../../utils/helpers.ts";
import { Calendar } from "lucide-react";
import TrainingBlockContainer from "./TrainingBlockContainer.tsx";

type TrainingBlockContainersList = {
  trainingBlockContainers: ContainerItem[];
  players: Player[];
};

export default function TrainingBlockContainersList({
  trainingBlockContainers,
  players,
}: TrainingBlockContainersList) {
  const {
    trainingBlockId,
    isOpen,
    setIsOpen,
    register,
    control,
    isSubmitting,
    isSaving,
    setIsSaving,
    isValidating,
    setError,
    errors,
    handleClose,
    handleSubmit,
    handleOpen,
  } = useEditTrainingBlockDialog();

  const trainingBlocks = trainingBlockContainers.map((container) => {
    const { type, ...trainingBlock } = container;
    return trainingBlock as TrainingBlock;
  });

  return (
    <>
      <Flex direction="column" gap="4">
        {DAYS.map((day) => {
          const filteredTrainingBlocks = trainingBlocks
            .filter((trainingBlock) => trainingBlock.day === day)
            .sort((a, b) => {
              return parseTime(a.start) - parseTime(b.start);
            });

          if (filteredTrainingBlocks.length === 0) {
            return null;
          }

          return (
            <Box
              key={day}
              p="4"
              style={{
                border: "1px solid var(--gray-6)",
                backgroundColor: "var(--color-panel)",
                borderRadius: "12px",
              }}
            >
              <Flex align="center" gap="4" mb="3">
                <Flex align="center" gap="1">
                  <Text size="5" color="gray" weight="bold">
                    {day}
                  </Text>
                </Flex>
                <Badge size="2" color="gray">
                  <Calendar size={15} />
                  {filteredTrainingBlocks.length} training blocks
                </Badge>
              </Flex>
              <Flex direction="column" gap="3">
                {filteredTrainingBlocks.map((trainingBlock) => {
                  const assignedPlayers = players.filter((player) =>
                    trainingBlock.assignedPlayers.includes(player.id),
                  );

                  return (
                    <TrainingBlockContainer
                      key={trainingBlock.id}
                      trainingBlock={trainingBlock}
                      handleOpen={handleOpen}
                      assignedPlayers={assignedPlayers}
                    />
                  );
                })}
              </Flex>
            </Box>
          );
        })}
      </Flex>
      <EditTrainingBlockDialog
        trainingBlockId={trainingBlockId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        register={register}
        control={control}
        isSubmitting={isSubmitting}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        isValidating={isValidating}
        setError={setError}
        errors={errors}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        trainingBlocks={trainingBlocks}
      />
    </>
  );
}
