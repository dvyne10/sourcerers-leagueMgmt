import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

import { createLeague, isLeagueAdmin, updateLeague, deleteLeague, updateLeagueTeams } from "./utils/leaguesModule.js";

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

app.post("/admin", (req, res) => {
  req.body.userId = "648ba153251b78d7946df311"  // Temp only
  // req.body.userId = "648ba154251b78d7946df338" // TEMP HARRY
  let leagueId = req.query.league;
  let teamId = req.query.team;
  let matchId = req.query.match;
  if (leagueId) {
    isLeagueAdmin(req.body.userId, leagueId)
    .then((data)=>{
      res.json(data);
    })
  } else if (teamId) {
    isTeamAdmin(req.body.userId, teamId)
    .then((data)=>{
      res.json(data);
    })
  } else if (matchId) {
    isMatchAdmin(req.body.userId, matchId)
    .then((data)=>{
      res.json(data);
    })
  }
  
});

app.post("/createleague", (req, res) => {
  createLeague(req.body)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/updateleague/:leagueid", (req, res) => {
  updateLeague(req.params.leagueid, req.body)
  .then((data)=>{
    res.json(data);
  })
});

app.delete("/updateleague/:leagueid", (req, res) => {
  updateLeague(req.params.leagueid, req.body)
  .then((data)=>{
    res.json(data);
  })
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
