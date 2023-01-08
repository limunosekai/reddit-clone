import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import { AppDataSource } from "../data-source";
import Sub from "../entities/Sub";
import User from "../entities/User";
import Post from "../entities/Post";

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
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
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

const topSubs = async (_, res: Response) => {
  try {
    const imageUrlExp = `COALESCE(s."imageUrn", 'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneByOrFail({ name });
    return res.json(sub);
  } catch (err) {
    console.error(err);
    return res
      .status(404)
      .json({ error: "해당 커뮤니티가 존재하지 않습니다." });
  }
};

const router = Router();

router.post("/", userMiddleware, authMiddleware, createSub);
router.get("/sub/topSubs", topSubs);
router.get("/:name", userMiddleware, getSub);

export default router;
