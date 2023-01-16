import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import subRoutes from "./routes/subs";
import postRoutes from "./routes/posts";
import voteRoutes from "./routes/votes";
import userRoutes from "./routes/users";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
const origin = process.env.ORIGIN;
const port = process.env.PORT;

app.use(
  cors({
    origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

dotenv.config();

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes);
app.use(express.static("public"));
app.listen(port, async () => {
  console.log(`Server running on ${origin} port ${port}`);
  AppDataSource.initialize()
    .then(async () => {
      console.log("DB initialized...");
    })
    .catch((error) => console.log(error));
});
