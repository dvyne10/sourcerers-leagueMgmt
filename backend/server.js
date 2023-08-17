import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import cron from "node-cron"
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { authenticate, getTokenFromCookies, adminAuthenticate } from "./middlewares/authMiddleware.js";
import { updateProfilePic, createTeamLogoAndBanner, updateTeamLogoAndBanner, createLeagueLogoAndBanner, updateLeagueLogoAndBanner } from "./middlewares/fileUploadMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

import { getHomeDetails } from "./utils/homePageModule.js";
import { getPlayers, getPlayerDetailsAndButtons, getMyProfile, getAccountDetailsUpdate, updateAccount, getUserFullname, changePassword } from "./utils/usersModule.js";
import { getTeams, getTeamDetailsAndButtons, createTeam, isTeamAdmin, getTeamDetailsForUpdate, updateTeam, deleteTeam, removePlayerFromTeam, updateLookingForPlayers } from "./utils/teamsModule.js";
import { getLeagues, createLeague, isLeagueAdmin, getLeagueDetailsForUpdate, updateLeague, deleteLeague, canUserCreateNewLeague, getLeagueDetailsAndButtons, updateLookingForTeams } from "./utils/leaguesModule.js";
import { getMatchDetails, getMatchDetailsUpdate, updateMatch } from "./utils/matchModule.js";
import { joinLeague, unjoinLeague, startLeague, cancelRequest, inviteToTeam, joinTeam, unjoinTeam, inviteToLeague } from "./utils/requestsModule.js";
import { getPlayers, getPlayerDetailsAndButtons, getMyProfile, getAccountDetailsUpdate, updateAccount, getUserFullname, 
  changePassword, unlockAccounts, deletePendingAccounts } from "./utils/usersModule.js";
import { getTeams, getTeamDetailsAndButtons, createTeam, isTeamAdmin, getTeamDetailsForUpdate, updateTeam, deleteTeam,
  removePlayerFromTeam, updateLookingForPlayers} from "./utils/teamsModule.js";
import { getLeagues, createLeague, isLeagueAdmin, getLeagueDetailsForUpdate, updateLeague, deleteLeague, canUserCreateNewLeague, 
  getLeagueDetailsAndButtons, updateLookingForTeams} from "./utils/leaguesModule.js";
import { getMatchDetails, getMatchDetailsUpdate, updateMatch } from "./utils/matchModule.js";
import { joinLeague, unjoinLeague, startLeague, cancelRequest, inviteToTeam, joinTeam, unjoinTeam, inviteToLeague } from "./utils/requestsModule.js";
import { getSportsList } from "./utils/sysParmModule.js";
import { getUnreadNotifsCount, getUserNotifications, readUnreadNotif, approveRequest, rejectRequest, processContactUsMsgs, housekeepNotifications } from "./utils/notificationsModule.js";
import { getSearchResults } from "./utils/searchModule.js";
import { adminGetUsers, adminGetUserDetails, adminCreateUser, adminUpdateUser, adminDeleteUser, adminGetMatches, adminGetTeams, adminGetTeamDetails, 
  adminCreateTeam, adminUpdateTeam, adminDeleteTeam, adminGetLeagues, adminGetLeagueDetails, adminCreateLeague, adminUpdateLeague,
  adminDeleteLeague, adminGetParms, adminGetParmDetails, adminCreateParm, adminUpdateParm, adminDeleteParm } from "./utils/adminModule.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
      "Origin",
      "X-Api-Key",
      "X-Requested-With",
      "Accept",
      "X-XSRF-TOKEN",
      "XSRF-TOKEN",
    ],
    origin: "https://playpal.netlify.app",
    exposedHeaders: ["*", "Authorization"],
    optionsSuccessStatus: 200,
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

app.get("/teams", (req, res) => {
  getTeams().then((data) => {
    res.json(data);
  });
});

app.get("/players", (req, res) => {
  getPlayers().then((data) => {
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
  let teamId = req.body.teamId;
  let msg = req.body.msg;
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

app.post("/team/:teamid", getTokenFromCookies, (req, res) => {
  getTeamDetailsAndButtons(req.userId, req.params.teamid).then((data) => {
    res.json(data);
  });
});

app.put("/lookingforplayerson/:teamid", authenticate, (req, res) => {
  updateLookingForPlayers(
    req.user._id.toString(),
    req.params.teamid,
    true
  ).then((data) => {
    res.json(data);
  });
});

app.put("/lookingforteamsoff/:teamid", authenticate, (req, res) => {
  updateLookingForPlayers(
    req.user._id.toString(),
    req.params.teamid,
    false
  ).then((data) => {
    res.json(data);
  });
});

app.post("/jointeam/:teamid", authenticate, (req, res) => {
  let msg = req.body.msg;
  joinTeam(req.user._id.toString(), req.params.teamid, msg).then((data) => {
    res.json(data);
  });
});

app.post("/unjointeam/:teamid", authenticate, (req, res) => {
  unjoinTeam(req.user._id.toString(), req.params.teamid).then((data) => {
    res.json(data);
  });
});

app.post("/invitetoleague/:teamid", authenticate, (req, res) => {
  let leagueId = req.body.leagueid;
  let msg = req.body.msg;
  inviteToLeague(
    req.user._id.toString(),
    leagueId,
    req.params.teamid,
    msg
  ).then((data) => {
    res.json(data);
  });
});

app.post("/player/:playerid", getTokenFromCookies, (req, res) => {
  getPlayerDetailsAndButtons(req.userId, req.params.playerid).then((data) => {
    res.json(data);
  });
});

app.post("/invitetoteam/:playerid", authenticate, (req, res) => {
  let teamId = req.body.teamId;
  let msg = req.body.msg;
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

app.post("/getmatchdetailsupdate/:matchid", authenticate, (req, res) => {
  getMatchDetailsUpdate(
    req.user._id.toString(),
    req.params.matchid,
    "USER"
  ).then((data) => {
    res.json(data);
  });
});

app.post("/updatematch/:matchid", authenticate, (req, res) => {
  updateMatch(
    req.user._id.toString(),
    req.params.matchid,
    req.body,
    "USER"
  ).then((data) => {
    res.json(data);
  });
});

app.get("/finduser/:username", (req, res) => {
  getUserFullname("", req.params.username).then((data) => {
    res.json(data);
  });
});

app.post("/notifunreadcount", authenticate, (req, res) => {
  getUnreadNotifsCount(req.user._id.toString()).then((data) => {
    res.json(data);
  });
});

app.post("/notifications", authenticate, (req, res) => {
  getUserNotifications(req.user._id.toString()).then((data) => {
    res.json(data);
  });
});

app.put("/notificationsread/:notifid", authenticate, (req, res) => {
  readUnreadNotif(req.user._id.toString(), req.params.notifid).then((data) => {
    res.json(data);
  });
});

app.put("/approverequest/:notifid", authenticate, (req, res) => {
  approveRequest(req.user._id.toString(), req.params.notifid).then((data) => {
    res.json(data);
  });
});

app.put("/rejectrequest/:notifid", authenticate, (req, res) => {
  rejectRequest(req.user._id.toString(), req.params.notifid).then((data) => {
    res.json(data);
  });
});

app.post("/myprofile", authenticate, (req, res) => {
  getMyProfile(req.user._id.toString())
  .then((data) => {
      res.json(data);
    }
  );
});

app.get("/search", (req, res) => {
  let findText = req.query.findtext;
  if (!findText) {
    findText = "";
  }
  let location = req.query.location;
  if (!location) {
    location = "";
  }
  let playerFilter = false;
  if (
    req.query.playerfilter &&
    req.query.playerfilter.toLocaleLowerCase() === "true"
  ) {
    playerFilter = true;
  }
  let teamFilter = false;
  if (
    req.query.teamfilter &&
    req.query.teamfilter.toLocaleLowerCase() === "true"
  ) {
    teamFilter = true;
  }
  let leagueFilter = false;
  if (
    req.query.leaguefilter &&
    req.query.leaguefilter.toLocaleLowerCase() === "true"
  ) {
    leagueFilter = true;
  }
  getSearchResults(
    findText,
    location,
    playerFilter,
    teamFilter,
    leagueFilter
  ).then((data) => {
    res.json(data);
  });
});

app.get("/getsportslist", (req, res) => {
  getSportsList().then((data) => {
    res.json(data);
  });
});

app.post("/getaccountdetailsupdate", authenticate, (req, res) => {
  getAccountDetailsUpdate(req.user._id.toString()).then((data) => {
    res.json(data);
  });
});

app.post("/updateaccount", authenticate, updateProfilePic, (req, res) => {
  updateAccount(req.user._id.toString(), req.body).then((data) => {
    res.json(data);
  });
});

app.post("/admin", authenticate, (req, res) => {
  let leagueId = req.query.league;
  let teamId = req.query.team;
  if (leagueId) {
    isLeagueAdmin(req.user._id.toString(), leagueId).then((data) => {
      res.json(data);
    });
  } else if (teamId) {
    isTeamAdmin(req.user._id.toString(), teamId).then((data) => {
      res.json(data);
    });
  }
});

app.post("/createteam", authenticate, createTeamLogoAndBanner, (req, res) => {
  createTeam(req.user._id.toString(), req.body, req.files).then((data) => {
    res.json(data);
  });
});

app.post("/getteamdetailsupdate/:teamid", authenticate, (req, res) => {
  getTeamDetailsForUpdate(req.user._id.toString(), req.params.teamid).then(
    (data) => {
      res.json(data);
    }
  );
});

app.post("/updateteam/:teamid", authenticate, updateTeamLogoAndBanner, (req, res) => {
  updateTeam(req.user._id.toString(), req.params.teamid, req.body).then(
    (data) => {
      res.json(data);
    }
  );
});

app.delete("/deleteteam/:teamid", authenticate, (req, res) => {
  deleteTeam(req.user._id.toString(), req.params.teamid).then((data) => {
    res.json(data);
  });
});

app.post("/removeplayer/:teamid/:playerid", authenticate, (req, res) => {
  removePlayerFromTeam(
    req.user._id.toString(),
    req.params.teamid,
    req.params.playerid
  ).then((data) => {
    res.json(data);
  });
});

app.post("/createleague", authenticate, createLeagueLogoAndBanner, (req, res) => {
  createLeague(req.user._id.toString(), req.body, req.files).then((data) => {
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

app.post("/updateleague/:leagueid", authenticate, updateLeagueLogoAndBanner, (req, res) => {
  updateLeague(req.user._id.toString(), req.params.leagueid, req.body).then(
    (data) => {
      res.json(data);
    }
  );
});

app.delete("/deleteleague/:leagueid", authenticate, (req, res) => {
  deleteLeague(req.user._id.toString(), req.params.leagueid).then((data) => {
    res.json(data);
  });
});

app.post("/changepassword", authenticate, (req, res) => {
  changePassword(req.user._id.toString(), req.body).then((data) => {
    res.json(data);
  });
});

app.post("/contactus", (req, res) => {
  processContactUsMsgs(req.body).then((data) => {
    res.json(data);
  });
});

app.post("/admingetusers", adminAuthenticate, (req, res) => {
  adminGetUsers().then((data) => {
    res.json(data);
  });
});

app.post("/admingetuser/:userid", adminAuthenticate, (req, res) => {
  adminGetUserDetails(req.params.userid).then((data) => {
    res.json(data);
  });
});

app.post("/admincreateuser", adminAuthenticate, (req, res) => {
  adminCreateUser(req.body).then((data) => {
    res.json(data);
  });
});

app.post("/adminupdateuser/:userid", adminAuthenticate, (req, res) => {
  adminUpdateUser(req.params.userid, req.body).then((data) => {
    res.json(data);
  });
});

app.delete("/admindeleteuser/:userid", adminAuthenticate, (req, res) => {
  adminDeleteUser(req.params.userid).then((data) => {
    res.json(data);
  });
});

app.post("/admingetteams", adminAuthenticate, (req, res) => {
  adminGetTeams().then((data) => {
    res.json(data);
  });
});

app.post("/admingetteamdetails/:teamid", adminAuthenticate, (req, res) => {
  adminGetTeamDetails(req.params.teamid).then((data) => {
    res.json(data);
  });
});

app.post("/admincreateteam", adminAuthenticate, (req, res) => {
  adminCreateTeam(req.body).then((data) => {
    res.json(data);
  });
});

app.post("/adminupdateteam/:teamid", adminAuthenticate, (req, res) => {
  adminUpdateTeam(req.params.teamid, req.body).then((data) => {
    res.json(data);
  });
});

app.delete("/admindeleteteam/:teamid", adminAuthenticate, (req, res) => {
  adminDeleteTeam(req.params.teamid).then((data) => {
    res.json(data);
  });
});

app.post("/admingetleagues", adminAuthenticate, (req, res) => {
  adminGetLeagues().then((data) => {
    res.json(data);
  });
});

app.post("/admingetleaguedetails/:leagueid", adminAuthenticate, (req, res) => {
  adminGetLeagueDetails(req.params.leagueid).then((data) => {
    res.json(data);
  });
});

app.post("/admincreateleague", adminAuthenticate, (req, res) => {
  adminCreateLeague(req.body).then((data) => {
    res.json(data);
  });
});

app.post("/adminupdateleague/:leagueid", adminAuthenticate, (req, res) => {
  adminUpdateLeague(req.params.leagueid, req.body).then((data) => {
    res.json(data);
  });
});

app.delete("/admindeleteleague/:leagueid", adminAuthenticate, (req, res) => {
  adminDeleteLeague(req.params.leagueid).then((data) => {
    res.json(data);
  });
});

app.post("/admingetmatches", adminAuthenticate, (req, res) => {
  adminGetMatches().then((data) => {
    res.json(data);
  });
});

app.post(
  "/admingetmatchdetailsupdate/:matchid",
  adminAuthenticate,
  (req, res) => {
    getMatchDetailsUpdate(
      req.user._id.toString(),
      req.params.matchid,
      "ADMIN"
    ).then((data) => {
      res.json(data);
    });
  }
);

app.post("/adminupdatematch/:matchid", adminAuthenticate, (req, res) => {
  updateMatch(
    req.user._id.toString(),
    req.params.matchid,
    req.body,
    "ADMIN"
  ).then((data) => {
    res.json(data);
  });
});

app.post("/admingetparms", adminAuthenticate, (req, res) => {
  adminGetParms().then((data) => {
    res.json(data);
  });
});

app.post("/admingetparmdetails/:parmid", adminAuthenticate, (req, res) => {
  adminGetParmDetails(req.params.parmid).then((data) => {
    res.json(data);
  });
});

app.post("/admincreateparm", adminAuthenticate, (req, res) => {
  adminCreateParm(req.body).then((data) => {
    res.json(data);
  });
});

app.post("/adminupdateparm/:parmid", adminAuthenticate, (req, res) => {
  adminUpdateParm(req.params.parmid, req.body).then((data) => {
    res.json(data);
  });
});

app.delete("/admindeleteparm/:parmid", adminAuthenticate, (req, res) => {
  adminDeleteParm(req.params.parmid).then((data) => {
    res.json(data);
  });
});

// Run job to unlock accounts every 10mins
cron.schedule('*/10 * * * *', () => {
  unlockAccounts()
  .then( console.log("Unlock accounts job ran."))
});

// Run job to delete pending accounts every 10mins
cron.schedule('*/10 * * * *', () => {
  deletePendingAccounts()
  .then( console.log("Deletion of pending accounts job ran."))
});

// Run job to housekeep notifications every midnight
cron.schedule('0 0 * * *', () => {
  housekeepNotifications()
  .then( console.log("Notifications housekeeping job ran."))
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
