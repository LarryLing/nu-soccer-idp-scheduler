import { type PropsWithChildren, useCallback, useState } from "react";
import { EditPlayerDialogContext } from "./EditPlayerDialogContext.tsx";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PlayerSchema } from "../utils/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlayers } from "../hooks/usePlayers.ts";
import type { Player } from "../utils/types.ts";

export function EditPlayerDialogProvider({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);
    const [playerId, setPlayerId] = useState("");

    const { editPlayer } = usePlayers();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        clearErrors,
        formState: { isSubmitting, isValidating, errors },
    } = useForm<z.infer<typeof PlayerSchema>>({
        resolver: zodResolver(PlayerSchema),
        defaultValues: {
            name: "",
            number: 0,
            position: "Goalkeeper",
            availabilities: [
                {
                    day: "Monday",
                    start: "9:30AM",
                    end: "10:00AM",
                },
            ],
        },
    });

    const { fields, append, remove, replace } = useFieldArray<
        z.infer<typeof PlayerSchema>
    >({
        control,
        name: "availabilities",
    });

    const handleOpen = useCallback(
        (player: Player) => {
            setValue("name", player.name);
            setValue("number", player.number);
            setValue("position", player.position);
            replace(player.availabilities);
            setPlayerId(player.id);
            setIsOpen(true);
        },
        [replace, setValue],
    );

    const handleClose = useCallback(() => {
        clearErrors();
        setIsOpen(false);
    }, [clearErrors]);

    const onSubmit = handleSubmit(async (data) => {
        setIsOpen(false);
        await editPlayer(playerId, data);
    });

    const value = {
        isOpen,
        setIsOpen,
        register,
        control,
        isSubmitting,
        isValidating,
        errors,
        fields,
        append,
        remove,
        handleOpen,
        handleClose,
        onSubmit,
    };

    return (
        <EditPlayerDialogContext.Provider value={value}>
            {children}
        </EditPlayerDialogContext.Provider>
    );
}
