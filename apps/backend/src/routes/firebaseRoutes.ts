import { Router } from "express";
import {
  createUser,
  signinUser,
  signoutUser,
  resetUserPassword,
  checkUser,
} from "../controllers/firebaseController";
import { verifyToken } from "../middleware/firebaseMiddleware";

const router = Router();

// @ts-ignore
router.get("/auth/check", verifyToken, checkUser);

router.post("/auth/register", createUser);
router.post("/auth/signin", signinUser);
// @ts-ignore
router.post("/auth/signout", verifyToken, signoutUser);
// @ts-ignore
router.post("/auth/reset-password", verifyToken, resetUserPassword);

export default router;
