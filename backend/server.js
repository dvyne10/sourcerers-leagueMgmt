import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

import { getLeagues, createLeague, isLeagueAdmin, updateLeague, deleteLeague, updateLeagueTeams, 
  canUserCreateNewLeague, getLeagueDetailsAndButtons, updateLookingForTeams,getLeagueAdmins, joinLeague, unjoinLeague,
  startLeague, getLeaguesCreated
   } from "./utils/leaguesModule.js";
import { getHomeDetails } from "./utils/homePageModule.js";
import { getRequestById, hasPendingRequest, cancelRequest } from "./utils/requestsModule.js";
import { getTeamDetails } from "./utils/teamsModule.js";
import { getSysParmList } from "./utils/sysParmModule.js";
import { getPlayers, getUserStats, getPlayerDetails, getUserStatsTotal } from "./utils/usersModule.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true)


app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  getHomeDetails()
  .then((data)=>{
    res.json(data);
  })
});

app.get("/leagues", (req, res) => {
  getLeagues()
  .then((data)=>{
    res.json(data);
  })
});

app.post("/canusercreatenewleague", (req, res) => {
  let userId = "648ba154251b78d7946df339" // temp - max reached
  //let userId = "648ba154251b78d7946df338" // temp - max NOT yet reached
  canUserCreateNewLeague(userId)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/league/:leagueid", (req, res) => {
  let userId = "648e132ff3d2cb1d615fbd9d" //TEMP ONLY
  getLeagueDetailsAndButtons(userId, req.params.leagueid)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/lookingforteamson/:leagueid", (req, res) => {
  let userId = "648e132ff3d2cb1d615fbd9d" //TEMP ONLY
  updateLookingForTeams(userId, req.params.leagueid, true)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/lookingforteamsoff/:leagueid", (req, res) => {
  let userId = "648e132ff3d2cb1d615fbd9d" //TEMP ONLY
  updateLookingForTeams(userId, req.params.leagueid, false)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/joinleague/:leagueid", (req, res) => {
  let userId = "648ba154251b78d7946df338" //TEMP ONLY
  let teamId = "648ba154251b78d7946df340"  // TEMP ONLY
  let msg = "This is a msg from the team to join league" //TEMP ONLY
  joinLeague(userId, teamId, req.params.leagueid, msg)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/unjoinleague/:leagueid", (req, res) => {
  let userId = "648e4ff1db2a68344fda3742" //TEMP ONLY
  //let userId = "648ba154251b78d7946df339" //league creator
  unjoinLeague(userId, req.params.leagueid)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/cancelrequest/:pendingrequestid", (req, res) => {
  let userId = "648ba154251b78d7946df338" //TEMP ONLY
  //let userId = "648ba154251b78d7946df339" //league creator
  cancelRequest(userId, req.params.pendingrequestid)
  .then((data)=>{
    res.json(data);
  })
});

app.post("/startleague/:leagueid", (req, res) => {
  let userId = "648e132ff3d2cb1d615fbd9d" //TEMP ONLY
  startLeague(userId, req.params.leagueid)
  .then((data)=>{
    res.json(data);
  })
});

app.get("/players", (req, res) => {
  getPlayers()
  .then((data)=>{
    res.json(data);
  })
});

app.post("/player/:playerid", (req, res) => {
  let userId = "648e132ff3d2cb1d615fbd9d" //TEMP ONLY
  getPlayerDetails(req.params.playerid)
  .then((data)=>{
    res.json(data);
  })
});

app.get("/testing", (req, res) => {
  //getLeagueDetails("648e9013466c1c995745907c")
  //getTeamDetails("648e224f91a1a82229a6c11f")
  //hasPendingRequest("APTMJ", "648ba154251b78d7946df33c", "", "648e80bb453c973512704aea", "")
  //getNSLeaguesUserIsAdmin("648e132ff3d2cb1d615fbd9d") //cNunez
  //getNSLeaguesUserIsAdmin("648ba154251b78d7946df339")
  //getRequestById("64bee2ccf271e5e25657c8e8")
  //getRequestById("64bee2ccf271e5e25657c8e8")
  //getLeagueAdmins("648e9013466c1c995745907c")
  //getSysParmList("notification_type")
  //deleteLeagues()
  //getUsersGames("648e7e34db2a68344fda38fc")  // 648e7e34db2a68344fda3928
  //getUserStats("648e7e34db2a68344fda3907")
  getUserStatsTotal("648e5a24db2a68344fda38e1")
  //getUserStats()
  .then((data)=>{
    res.json(data);
  })
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


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
