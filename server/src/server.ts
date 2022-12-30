import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoute from "./routes/auth";
import cors from "cors";

const app = express();
const origin = "http://localhost:3000";

app.use(
  cors({
    origin,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoute);

let PORT = 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  AppDataSource.initialize()
    .then(async () => {
      console.log("DB initialized...");
    })
    .catch((error) => console.log(error));
});
