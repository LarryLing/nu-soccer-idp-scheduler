import { type PropsWithChildren, useEffect, useState } from "react";
import type { Player } from "../utils/types.ts";
import { PlayersContext } from "./PlayersContext.tsx";

const tempPlayers: Player[] = [
    {
        id: "0",
        number: 0,
        name: "Dominic Pereira",
        position: "Goalkeeper",
        availabilities: [
            {
                day: "Monday",
                start: "8:00am",
                end: "10:30am",
            },
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
        availabilities: [
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
        availabilities: [
            {
                day: "Tuesday",
                start: "7:00pm",
                end: "9:00pm",
            },
        ],
    },
];

export function PlayersProvider({ children }: PropsWithChildren) {
    const [players, setPlayers] = useState<Player[]>(tempPlayers);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const addPlayer = (player?: Player) => {
        if (!player) {
            throw new Error("Player is required");
        }

        setPlayers((prev) => [...prev, player]);
    };

    const removePlayer = (playerId?: string) => {
        if (!playerId) {
            throw new Error("Player ID is required");
        }

        setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    };

    const removePlayers = (playerIds?: string[]) => {
        if (!playerIds) {
            throw new Error("Player IDs are required");
        }

        setPlayers((prev) =>
            prev.filter((player) => !playerIds.includes(player.id)),
        );
    };

    useEffect(() => {
        //TODO: Add data fetching from Firebase database
        setIsLoading(false);
    }, []);

    const value = {
        players: players,
        isLoading: isLoading,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        removePlayers: removePlayers,
    };

    return (
        <PlayersContext.Provider value={value}>
            {!isLoading && children}
        </PlayersContext.Provider>
    );
}
