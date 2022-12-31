import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoute from "./routes/auth";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const origin = "http://localhost:3000";

app.use(
  cors({
    origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

dotenv.config();

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoute);
app.listen(process.env.PORT, async () => {
  console.log(`Server running on port ${process.env.PORT}`);
  AppDataSource.initialize()
    .then(async () => {
      console.log("DB initialized...");
    })
    .catch((error) => console.log(error));
});
