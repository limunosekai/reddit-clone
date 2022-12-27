import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.get("/", (_, res) => res.send("running"));

let PORT = 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  AppDataSource.initialize()
    .then(async () => {
      console.log("DB initialized...");
    })
    .catch((error) => console.log(error));
});
