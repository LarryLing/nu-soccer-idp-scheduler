import type { ContainerItem, TrainingBlock } from "../../utils/types.ts";
import TrainingBlockCard from "./TrainingBlockCard.tsx";
import { Grid } from "@radix-ui/themes";
import { useEditTrainingBlockDialog } from "../../hooks/useEditTrainingBlockDialog.tsx";
import EditTrainingBlockDialog from "./EditTrainingBlockDialog.tsx";

type TrainingBlocksGridProps = {
  trainingBlockContainers: ContainerItem[];
};

export default function TrainingBlocksGrid({
  trainingBlockContainers,
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

  const trainingBlocks = trainingBlockContainers.map((container) => {
    const { type, ...trainingBlock } = container;
    return trainingBlock as TrainingBlock;
  });

  return (
    <>
      <Grid
        columns="3"
        gap="4"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(max(256px, calc((100% - 32px) / 3)), 1fr))",
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
