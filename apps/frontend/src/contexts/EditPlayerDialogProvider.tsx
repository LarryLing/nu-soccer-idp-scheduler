import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { EditPlayerDialogContext } from "./EditPlayerDialogContext.tsx";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PlayerSchema } from "../utils/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Player } from "../utils/types.ts";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../utils/firebase.ts";
import { useUser } from "../hooks/useUser.ts";
import { DEFAULT_AVAILABILITY, DEFAULT_VALUES } from "../utils/constants.ts";

export function EditPlayerDialogProvider({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);
    const [playerId, setPlayerId] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const { user } = useUser();

    const {
        register,
        handleSubmit,
        control,
        setError,
        clearErrors,
        reset,
        formState: { isSubmitting, isValidating, errors },
    } = useForm<z.infer<typeof PlayerSchema>>({
        resolver: zodResolver(PlayerSchema),
        defaultValues: DEFAULT_VALUES,
    });

    const { fields, append, remove } = useFieldArray<
        z.infer<typeof PlayerSchema>
    >({
        control,
        name: "availabilities",
    });

    const handleOpen = useCallback(
        (player: Player) => {
            reset({
                name: player.name,
                number: player.number,
                position: player.position,
                availabilities: player.availabilities,
            });
            setPlayerId(player.id);
            setIsOpen(true);
        },
        [reset],
    );

    const handleClose = useCallback(() => {
        clearErrors();
        setIsOpen(false);
    }, [clearErrors]);

    const onSubmit = useCallback(
        async (data: z.infer<typeof PlayerSchema>) => {
            if (!user?.uid) {
                console.error("User not authenticated");
                return;
            }

            if (!playerId) {
                console.error("No player selected for editing");
                return;
            }

            setIsSaving(true);

            try {
                await updateDoc(
                    doc(
                        clientFirestore,
                        `users/${user.uid}/players/${playerId}`,
                    ),
                    data,
                );
                setIsOpen(false);
            } catch (error) {
                console.error("Failed to update player:", error);

                setError("name", {
                    type: "manual",
                    message: "An unexpected error occurred",
                });
            } finally {
                setIsSaving(false);
            }
        },
        [playerId, setError, user],
    );

    const handleFormSubmit = useMemo(
        () => handleSubmit(onSubmit),
        [handleSubmit, onSubmit],
    );

    const addAvailability = useCallback(() => {
        append(DEFAULT_AVAILABILITY);
    }, [append]);

    const value = useMemo(
        () => ({
            isOpen,
            setIsOpen,
            register,
            control,
            isSubmitting,
            isSaving,
            isValidating,
            errors,
            fields,
            remove,
            handleOpen,
            handleClose,
            addAvailability,
            onSubmit: handleFormSubmit,
        }),
        [
            isOpen,
            register,
            control,
            isSubmitting,
            isSaving,
            isValidating,
            errors,
            fields,
            remove,
            handleOpen,
            handleClose,
            addAvailability,
            handleFormSubmit,
        ],
    );

    return (
        <EditPlayerDialogContext.Provider value={value}>
            {children}
        </EditPlayerDialogContext.Provider>
    );
}
