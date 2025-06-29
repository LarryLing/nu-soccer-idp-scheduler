import type { TrainingBlock } from "../../utils/types.ts";
import TrainingBlockCard from "./TrainingBlockCard.tsx";
import { Grid } from "@radix-ui/themes";
import { useEditTrainingBlockDialog } from "../../hooks/useEditTrainingBlockDialog.tsx";

type TrainingBlocksGridProps = {
  trainingBlocks: TrainingBlock[];
};

export default function TrainingBlocksGrid({
  trainingBlocks,
}: TrainingBlocksGridProps) {
  const { EditTrainingBlockDialog, handleOpen } = useEditTrainingBlockDialog();

  return (
    <>
      <Grid
        columns="3"
        gap="4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(256px, 1fr))",
        }}
      >
        {trainingBlocks.map((trainingBlock) => (
          <TrainingBlockCard
            key={trainingBlock.id}
            trainingBlock={trainingBlock}
            handleOpen={handleOpen}
          />
        ))}
      </Grid>
      <EditTrainingBlockDialog />
    </>
  );
}
