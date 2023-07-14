import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

import { createleague } from "./utils/leaguesModule.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRoutes);

app.get("/leagues", (req, res) => {
  res.send({ message: "Welcome to the Leagues page." });
});

app.get("/", (req, res) => {
  res.send({ message: "server is working perfectly fine from the home route" });
});

app.post("/createleague", (req, res) => {
  createleague(req.body)
  .then((data)=>{
    res.json(data);
  })
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
