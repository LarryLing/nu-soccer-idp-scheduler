import { Request, Response } from "express";
import { adminAuth } from "../config/firebase";
import { IGetUserAuthInfoRequest } from "../types";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRecord = await adminAuth.createUser({ email, password });

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error: any) {
    console.error("Error creating user", error);

    res.status(400).json({
      error: error.message,
    });
  }
};

export const signinUser = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    // Verify ID token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Get user data
    const user = await adminAuth.getUser(decodedToken.uid);

    res.status(200).json({
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const signoutUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (uid) {
      await adminAuth.revokeRefreshTokens(uid);
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const checkUser = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
) => {
  try {
    const userRecord = await adminAuth.getUser(req.user.uid);

    res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      message: "Error fetching user data",
    });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  const { uid, password } = req.body;

  try {
    const userRecord = await adminAuth.updateUser(uid, {
      password: password,
    });

    res.status(200).json({
      isAuthenticated: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      isAuthenticated: false,
      message: "Failed to reset user password",
    });
  }
};
