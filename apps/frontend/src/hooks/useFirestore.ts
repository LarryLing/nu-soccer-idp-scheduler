import { FirestoreContext } from "../contexts/FirestoreContext.tsx";
import { useContext } from "react";

export const useFirestore = () => {
    const context = useContext(FirestoreContext);

    if (context === undefined) {
        throw new Error("useFirestore must be used within a FirestoreProvider");
    }

    return context;
};
