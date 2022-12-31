import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import { AppDataSource } from "../data-source";
import Sub from "../entities/Sub";
import User from "../entities/User";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(name)) {
      errors.name = "이름을 입력하세요.";
    }
    if (isEmpty(title)) {
      errors.title = "타이틀을 입력하세요.";
    }

    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowercase() })
      .getOne();

    if (sub) {
      errors.name = "이미 존재하는 이름입니다.";
    }

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "알 수 없는 문제가 발생했습니다." });
  }

  try {
    const user: User = res.locals.user;

    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();
    return res.json(sub);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "알 수 없는 문제가 발생했습니다." });
  }
};

const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
