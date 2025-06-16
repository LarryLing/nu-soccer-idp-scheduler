import cors from "cors";
import express from "express";
import config from "./config/config";
import router from "./routes/routes.ts";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", router);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`App listening on port: ${config.port}`);
});
