import { adminAuth } from "../config/firebase";
import { Response, NextFunction } from "express";
import { IGetUserAuthInfoRequest } from "../types";

export const verifyToken = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const idToken = authHeader.split("Bearer ")[1];
        req.user = await adminAuth.verifyIdToken(idToken);

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
};
