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
  getMyProfile,
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
} from "./utils/requestsModule.js";
import {
  getPosnAndStatBySport,
} from "./utils/sysParmModule.js";
import {getUserNotifications, readUnreadNotif, approveRequest, rejectRequest} from "./utils/notificationsModule.js";
import {getSearchResults, searchTeams} from "./utils/searchModule.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "Origin", "X-Api-Key", "X-Requested-With", "Accept", "X-XSRF-TOKEN", "XSRF-TOKEN"],
    origin: "https://playpal.netlify.app",
    preflightContinue: true,
    exposedHeaders: ["*", "Authorization"],
    optionsSuccessStatus: 200
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
    res.json(data);
  });
});

app.get("/leagues", (req, res) => {
  getLeagues().then((data) => {
    res.json(data);
  });
});

app.post("/canusercreatenewleague", authenticate, (req, res) => {
  canUserCreateNewLeague(req.user._id.toString()).then((data) => {
    res.json(data);
  });
});

app.post("/league/:leagueid", getTokenFromCookies, (req, res) => {
  getLeagueDetailsAndButtons(req.userId, req.params.leagueid).then((data) => {
    res.json(data);
  });
});

app.put("/lookingforteamson/:leagueid", authenticate, (req, res) => {
  updateLookingForTeams(
    req.user._id.toString(),
    req.params.leagueid,
    true
  ).then((data) => {
    res.json(data);
  });
});

app.put("/lookingforteamsoff/:leagueid", authenticate, (req, res) => {
  updateLookingForTeams(
    req.user._id.toString(),
    req.params.leagueid,
    false
  ).then((data) => {
    res.json(data);
  });
});

app.post("/joinleague/:leagueid", authenticate, (req, res) => {
  let teamId = "648ba154251b78d7946df340"; // TEMP ONLY
  let msg = "This is a msg from the team to join league"; //TEMP ONLY
  joinLeague(req.user._id.toString(), teamId, req.params.leagueid, msg).then(
    (data) => {
      res.json(data);
    }
  );
});

app.post("/unjoinleague/:leagueid", authenticate, (req, res) => {
  unjoinLeague(req.user._id.toString(), req.params.leagueid).then((data) => {
    res.json(data);
  });
});

app.post("/cancelrequest/:pendingrequestid", authenticate, (req, res) => {
  cancelRequest(req.user._id.toString(), req.params.pendingrequestid).then(
    (data) => {
      res.json(data);
    }
  );
});

app.post("/startleague/:leagueid", authenticate, (req, res) => {
  startLeague(req.user._id.toString(), req.params.leagueid).then((data) => {
    res.json(data);
  });
});

app.get("/players", (req, res) => {
  getPlayers().then((data) => {
    res.json(data);
  });
});

app.post("/player/:playerid", getTokenFromCookies, (req, res) => {
  getPlayerDetailsAndButtons(req.userId, req.params.playerid).then((data) => {
    res.json(data);
  });
});

app.post("/invitetoteam/:playerid", authenticate, (req, res) => {
  let teamId = "648e7418b5437b97e2eef0a8"; //TEMp ONLY - Team Falcon
  let msg = "This is a msg from the admin to join team."; //TEMP ONLY
  inviteToTeam(req.user._id.toString(), teamId, req.params.playerid, msg).then(
    (data) => {
      res.json(data);
    }
  );
});

app.post("/match/:matchid", getTokenFromCookies, (req, res) => {
  getMatchDetails(req.userId, req.params.matchid).then((data) => {
    res.json(data);
  });
});

app.post("/notifications", authenticate, (req, res) => {
  getUserNotifications(req.user._id.toString())
  .then((data) => {
      res.json(data);
    }
  );
});

app.put("/notificationsread/:notifid", authenticate, (req, res) => {
  readUnreadNotif(req.user._id.toString(), req.params.notifid)
  .then((data) => {
      res.json(data);
    }
  );
});

app.put("/approverequest/:notifid", authenticate, (req, res) => {
  approveRequest(req.user._id.toString(), req.params.notifid)
  .then((data) => {
      res.json(data);
    }
  );
});

app.put("/rejectrequest/:notifid", authenticate, (req, res) => {
  rejectRequest(req.user._id.toString(), req.params.notifid)
  .then((data) => {
      res.json(data);
    }
  );
});

app.put("/myprofile", authenticate, (req, res) => {
  getMyProfile(req.user._id.toString())
  .then((data) => {
      res.json(data);
    }
  );
});

app.get("/search", (req, res) => {
  let findText = req.query.findtext
  if (!findText) {
    findText = ""
  }
  let location = req.query.location
  if (!location) {
    location = ""
  }
  let playerFilter = false
  if (req.query.playerfilter && req.query.playerfilter.toLocaleLowerCase() === "true") {
      playerFilter = true
  }
  let teamFilter = false
  if (req.query.teamfilter && req.query.teamfilter.toLocaleLowerCase() === "true") {
      teamFilter = true
  }
  let leagueFilter = false
  if (req.query.leaguefilter && req.query.leaguefilter.toLocaleLowerCase() === "true") {
      leagueFilter = true
  }
  getSearchResults(findText, location, playerFilter, teamFilter, leagueFilter)
  .then((data) => {
      res.json(data);
    }
  );
});

app.get("/testing", (req, res) => {
  searchTeams("o", "")
  .then((data) => {
    res.json(data);
  });
});

app.post("/admin", authenticate, (req, res) => {
  let leagueId = req.query.league;
  let teamId = req.query.team;
  let matchId = req.query.match;
  if (leagueId) {
    isLeagueAdmin(req.user._id.toString(), leagueId).then((data) => {
      res.json(data);
    });
  } else if (teamId) {
    isTeamAdmin(req.user._id.toString(), teamId).then((data) => {
      res.json(data);
    });
  } else if (matchId) {
    isMatchAdmin(req.user._id.toString(), matchId).then((data) => {
      res.json(data);
    });
  }
});

app.post("/createleague", authenticate, (req, res) => {
  createLeague(req.user._id.toString(), req.body).then((data) => {
    res.json(data);
  });
});

app.post("/getleaguedetailsupdate/:leagueid", authenticate, (req, res) => {
  getLeagueDetailsForUpdate(req.user._id.toString(), req.params.leagueid).then(
    (data) => {
      res.json(data);
    }
  );
});

app.post("/updateleague/:leagueid", authenticate, (req, res) => {
  updateLeague(req.user._id.toString(), req.params.leagueid, req.body).then(
    (data) => {
      res.json(data);
    }
  );
});

app.delete("/updateleague/:leagueid", authenticate, (req, res) => {
  updateLeague(req.user._id.toString(), req.params.leagueid, req.body).then(
    (data) => {
      res.json(data);
    }
  );
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
