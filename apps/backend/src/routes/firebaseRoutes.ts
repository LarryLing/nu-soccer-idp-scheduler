import { Router } from "express";
import { register, signin, signout } from "../controllers/firebaseController";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/signin", signin);
router.get("/auth/signout", signout);

export default router;
