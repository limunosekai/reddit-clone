import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const vote = async (req: Request, res: Response) => {};

const router = Router();
router.post("/", userMiddleware, authMiddleware, vote);

export default router;
