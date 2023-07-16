import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

import { createLeague, isLeagueAdmin, updateLeague, deleteLeague, updateLeagueTeams } from "./utils/leaguesModule.js";
import { getMatch, updateMatch } from './utils/matchModule.js'; 

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
  req.body.userId = "648e0a6ff1915e7c19e2303a"  // Temp only league creator
  //req.body.userId = "648e132ff3d2cb1d615fbd9d" // TEMP team Creator
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


// app.get("/updatematch/:matchid", (req, res)=> {
//   const matchId = req.params.matchid; 

//   getMatch('648ba154251b78d7946df33a')
//     .then(response => {
//       if (response.requestStatus === "ACTC") {
//         console.log(response.data); 
//         res.status(200).json(response.data); 
//       } else {
//         res.status(400).json({message: response.errMsg}); 
//       }
//     })
//     .catch(error => {
//         res.status(500).json({message: error.message}); 
//     })
// }); 

app.post("/updatematch/:matchid", (req, res) => {
  updateMatch(req.params.matchid, req.body)
  .then((data)=>{
    console.log(data);
  }).catch(()=>{
    console.log(req.body); 
  })
});


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
