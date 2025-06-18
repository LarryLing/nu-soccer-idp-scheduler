import firebaseRoutes from "./routes/firebaseRoutes";
import express from "express";
import cookieParser from "cookie-parser";

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", firebaseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
