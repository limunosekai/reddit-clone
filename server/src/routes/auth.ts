import { isEmpty, validate } from "class-validator";
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "../entities/User";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    if (emailUser) {
      errors.email = "이미 사용하고 있는 이메일입니다.";
    }
    if (usernameUser) {
      errors.username = "이미 사용하고 있는 이름입니다";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json(mapError(errors));
    }

    await user.save();
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) {
      errors.username = "사용자 이름을 입력하세요";
    }
    if (isEmpty(password)) {
      errors.username = "비밀번호를 입력하세요";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = await User.findOneBy({ username });

    if (!user) {
      return res.status(404).json({ username: "등록되지 않은 회원입니다." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ password: "비밀번호가 맞지 않습니다." });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    );
    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
};

const me = async (_, res: Response) => {
  return res.json(res.locals.user);
};

const logout = async (_, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  res.status(200).json({ success: true });
};

const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout);

export default router;
