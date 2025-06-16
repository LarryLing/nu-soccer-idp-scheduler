import { Router } from "express";
import { getTest, getAnotherTest } from "../controllers/controller.ts";

const router = Router();

router.get("/test", getTest);
router.get("/another-test", getAnotherTest);

export default router;
