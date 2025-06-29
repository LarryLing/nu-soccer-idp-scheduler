import type { TrainingBlock } from "../../utils/types.ts";
import TrainingBlockCard from "./TrainingBlockCard.tsx";
import { Grid } from "@radix-ui/themes";
import { useEditTrainingBlockDialog } from "../../hooks/useEditTrainingBlockDialog.tsx";
import EditTrainingBlockDialog from "./EditTrainingBlockDialog.tsx";

type TrainingBlocksGridProps = {
  trainingBlocks: TrainingBlock[];
};

export default function TrainingBlocksGrid({
  trainingBlocks,
}: TrainingBlocksGridProps) {
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
