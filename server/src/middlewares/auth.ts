import { NextFunction, Response } from "express";
import User from "../entities/User";

export default async (_, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) {
      throw new Error("Unauthenticated");
    }
    return next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "사용자 인증에 실패하였습니다." });
  }
};
