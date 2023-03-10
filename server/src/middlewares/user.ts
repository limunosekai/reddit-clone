import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next();
    }
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneBy({ username });
    if (!user) {
      throw new Error("Unauthenticated !");
    }

    res.locals.user = user;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "사용자 인증에 실패하였습니다." });
  }
};
