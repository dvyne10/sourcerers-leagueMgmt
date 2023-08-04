import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import {
  authenticate,
  getTokenFromCookies,
} from "./middlewares/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

import { getHomeDetails } from "./utils/homePageModule.js";
import {
  getPlayers,
  getPlayerDetailsAndButtons,
  getUserWinsCount,
} from "./utils/usersModule.js";
import {
  getTeamDetails,
  isTeamMember,
  getUsersTeams,
} from "./utils/teamsModule.js";
import {
  getLeagues,
  createLeague,
  isLeagueAdmin,
  getLeagueDetailsForUpdate,
  updateLeague,
  deleteLeague,
  updateLeagueTeams,
  canUserCreateNewLeague,
  getLeagueDetailsAndButtons,
  updateLookingForTeams,
} from "./utils/leaguesModule.js";
import { getMatchDetails } from "./utils/matchModule.js";
import {
  joinLeague,
  unjoinLeague,
  startLeague,
  cancelRequest,
  inviteToTeam,
  getRequestStatus,
} from "./utils/requestsModule.js";
import {
  getSysParmList,
  getPosnAndStatBySport,
} from "./utils/sysParmModule.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    origin: "https://playpal.netlify.app",
    // origin: [
    //   "http://127.0.0.1:5173",
    //   "https://playpal.netlify.app/",
    //   "http://localhost:5173",
    // ],
    preflightContinue: true,
    exposedHeaders: ["*", "Authorization"],
  })
);

app.use((req, res, next) => {
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.static("images"));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  getHomeDetails().then((data) => {
    res.status(200).json(data);
  });
});

app.get("/leagues", (req, res) => {
  getLeagues().then((data) => {
    res.status(200).json(data);
  });
});

app.post("/canusercreatenewleague", authenticate, (req, res) => {
  canUserCreateNewLeague(req.user._id.toString()).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/league/:leagueid", getTokenFromCookies, (req, res) => {
  getLeagueDetailsAndButtons(req.userId, req.params.leagueid).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/lookingforteamson/:leagueid", authenticate, (req, res) => {
  updateLookingForTeams(
    req.user._id.toString(),
    req.params.leagueid,
    true
  ).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/lookingforteamsoff/:leagueid", authenticate, (req, res) => {
  updateLookingForTeams(
    req.user._id.toString(),
    req.params.leagueid,
    false
  ).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/joinleague/:leagueid", authenticate, (req, res) => {
  let teamId = "648ba154251b78d7946df340"; // TEMP ONLY
  let msg = "This is a msg from the team to join league"; //TEMP ONLY
  joinLeague(req.user._id.toString(), teamId, req.params.leagueid, msg).then(
    (data) => {
      res.status(200).json(data);
    }
  );
});

app.post("/unjoinleague/:leagueid", authenticate, (req, res) => {
  unjoinLeague(req.user._id.toString(), req.params.leagueid).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/cancelrequest/:pendingrequestid", authenticate, (req, res) => {
  cancelRequest(req.user._id.toString(), req.params.pendingrequestid).then(
    (data) => {
      res.status(200).json(data);
    }
  );
});

app.post("/startleague/:leagueid", authenticate, (req, res) => {
  startLeague(req.user._id.toString(), req.params.leagueid).then((data) => {
    res.status(200).json(data);
  });
});

app.get("/players", (req, res) => {
  getPlayers().then((data) => {
    res.status(200).json(data);
  });
});

app.post("/player/:playerid", getTokenFromCookies, (req, res) => {
  getPlayerDetailsAndButtons(req.userId, req.params.playerid).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/invitetoteam/:playerid", authenticate, (req, res) => {
  let teamId = "648e7418b5437b97e2eef0a8"; //TEMp ONLY - Team Falcon
  let msg = "This is a msg from the admin to join team."; //TEMP ONLY
  inviteToTeam(req.user._id.toString(), teamId, req.params.playerid, msg).then(
    (data) => {
      res.status(200).json(data);
    }
  );
});

app.post("/match/:matchid", getTokenFromCookies, (req, res) => {
  getMatchDetails(req.userId, req.params.matchid).then((data) => {
    res.status(200).json(data);
  });
});

app.get("/testing", (req, res) => {
  //TEMP ONLY FOR TESTING PURPOSES
  //getOtherTwoMatches("64c3deff7ac9bd6a6d2daa4e", "648e224f91a1a82229a6c11f", "648e73a55b8b7790abd4856e")
  //isValidPassword("a%cdef3hikA")
  getRequestStatus("64bf3a1e812301f22152f0e8").then((data) => {
    res.status(200).json(data);
  });
});

app.post("/admin", authenticate, (req, res) => {
  let leagueId = req.query.league;
  let teamId = req.query.team;
  let matchId = req.query.match;
  if (leagueId) {
    isLeagueAdmin(req.user._id.toString(), leagueId).then((data) => {
      res.status(200).json(data);
    });
  } else if (teamId) {
    isTeamAdmin(req.user._id.toString(), teamId).then((data) => {
      res.status(200).json(data);
    });
  } else if (matchId) {
    isMatchAdmin(req.user._id.toString(), matchId).then((data) => {
      res.status(200).json(data);
    });
  }
});

app.post("/createleague", authenticate, (req, res) => {
  createLeague(req.user._id.toString(), req.body).then((data) => {
    res.status(200).json(data);
  });
});

app.post("/getleaguedetailsupdate/:leagueid", authenticate, (req, res) => {
  getLeagueDetailsForUpdate(req.user._id.toString(), req.params.leagueid).then(
    (data) => {
      res.status(200).json(data);
    }
  );
});

app.post("/updateleague/:leagueid", authenticate, (req, res) => {
  updateLeague(req.user._id.toString(), req.params.leagueid, req.body).then(
    (data) => {
      res.status(200).json(data);
    }
  );
});

app.delete("/updateleague/:leagueid", authenticate, (req, res) => {
  updateLeague(req.user._id.toString(), req.params.leagueid, req.body).then(
    (data) => {
      res.status(200).json(data);
    }
  );
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
