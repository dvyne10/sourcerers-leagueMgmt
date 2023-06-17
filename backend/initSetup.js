const mongoose = require("mongoose");
const { createHash } = require("crypto");
const crypto = require("crypto");
const system_parameter = require("./models/system_parameter");
const league = require("./models/league");
const user = require("./models/user");

const mongoDB =
  "mongodb+srv://sourcerers_admin1:$0urc3r3r$@cluster0.p3dghoi.mongodb.net/cslmDatabase?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(mongoDB);

    // Add admin user
    let adminUser = new user({
      status: "ACTV",
      userName: "admin01",
      email: "cslmadmin@cslm.com",
      password:
        "291802c0a085be61cff9b51165bd24543c732320b074650cb157adfc6f84e23c",
      salt: "c4oChLiw6x7sZs75NQx3ug==",
      userType: "ADMIN",
      announcementsCreated: [{ 
        showInHome: true,
        announcementMsg: "This is a test message from the admin team.",
      }],
      firstName: "Admin CSLM",
      lastName: " -- 01",
      successfulLoginDetails: [
        {
          sourceIPAddress: "194.120.180.275",
          timestamp: getTimestamp(0),
        },
      ],
    });
    await adminUser.save()
    .then(function () {
      console.log("Admin user inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add Soccer Parameters
    const soccer = new system_parameter({
      parameterId: "sport",
      sport: {
        sportsTypeId: "SOCCER",
        sportsName: "Soccer",
      },
      createdBy: adminUser._id,
    });
    await soccer.save()
    .then(function () {
      console.log("Soccer document inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    await system_parameter
      .insertMany([
        {
          parameterId: "statistic",
          statistic: {
            statisticsId: "SC01",
            statShortDesc: "Goals",
            statLongDesc: "Goals",
            sportsType: soccer._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "statistic",
          statistic: {
            statisticsId: "SC02",
            statShortDesc: "Assists",
            statLongDesc: "Assists",
            sportsType: soccer._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "statistic",
          statistic: {
            statisticsId: "SC03",
            statShortDesc: "Shots",
            statLongDesc: "Shots",
            sportsType: soccer._id,
          },
          createdBy: adminUser._id,
        },
      ])
      .then(function () {
        console.log("Soccer statistics data inserted.");
      })
      .catch(function (error) {
        console.log(error);
      });

    await system_parameter
      .insertMany([
        {
          parameterId: "position",
          position: {
            positionId: "SCP01",
            positionDesc: "Team Captain",
            sportsType: soccer._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "position",
          position: {
            positionId: "SCP02",
            positionDesc: "Goalkeeper",
            sportsType: soccer._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "position",
          position: {
            positionId: "SCP03",
            positionDesc: "Defender ",
            sportsType: soccer._id,
          },
          createdBy: adminUser._id,
        },
      ])
      .then(function () {
        console.log("Soccer positions data inserted.");
      })
      .catch(function (error) {
        console.log(error);
      });

    // Add basketball parameters
    const basket = new system_parameter({
      parameterId: "sport",
      sport: {
        sportsTypeId: "BASKET",
        sportsName: "Basketball",
      },
      createdBy: adminUser._id,
    });
    await basket.save()
    .then(function () {
      console.log("Basketball document inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    await system_parameter
      .insertMany([
        {
          parameterId: "statistic",
          statistic: {
            statisticsId: "BB01",
            statShortDesc: "Points",
            statLongDesc: "Goals",
            sportsType: basket._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "statistic",
          statistic: {
            statisticsId: "BB02",
            statShortDesc: "Rebounds",
            statLongDesc: "Assists",
            sportsType: basket._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "statistic",
          statistic: {
            statisticsId: "BB03",
            statShortDesc: "Assists",
            statLongDesc: "Shots",
            sportsType: basket._id,
          },
          createdBy: adminUser._id,createdBy: adminUser._id,
        },
      ])
      .then(function () {
        console.log("Basketball statistics data inserted.");
      })
      .catch(function (error) {
        console.log(error);
      });

    await system_parameter
      .insertMany([
        {
          parameterId: "position",
          position: {
            positionId: "BBP01",
            positionDesc: "Team Captain",
            sportsType: basket._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "position",
          position: {
            positionId: "BBP02",
            positionDesc: "Point Guard",
            sportsType: basket._id,
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "position",
          position: {
            positionId: "BBP03",
            positionDesc: "Shooting Guard",
            sportsType: basket._id,
          },
          createdBy: adminUser._id,
        },
      ])
      .then(function () {
        console.log("Basketball positions data inserted.");
      })
      .catch(function (error) {
        console.log(error);
      });

    // Add login parameters
    const login = new system_parameter({
      parameterId: "login",
      login: {
        numberOfLoginDtlsToKeep: 10,
        defaultLoginTries: 5,
        maxAdditionalLoginTries: 5,
        lockedAccountTiming: 30,
        otpExpiry: 3,
        minPasswordLength: 8,
        passwordCriteria: {
          capitalLetterIsRequired: true,
          capitalLettersList: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          specialCharacterIsRequired: true,
          specialCharsList: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
          numberIsRequired: true,
          numbersList: "0123456789",
        },
      },
      createdBy: adminUser._id,
    });
    await login.save()
    .then(function () {
      console.log("Login parameters inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add default announcement parameters
    const announce = new system_parameter({
      parameterId: "dfltAnnouncement",
      dfltAnnouncement: {
        defaultMsgTeamAncmt: "Team &teamName is looking for players!",
        defaultMsgLeagueAncmt:
          "League &leagueName is looking for more teams to join!",
      },
      createdBy: adminUser._id,
    });
    await announce.save()
    .then(function () {
      console.log("Default announcement parameters inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add default maximum parameters
    const maxParms = new system_parameter({
      parameterId: "maxParms",
      maxParms: {
        maxActiveLeaguesCreated: 5,
        startLeagueApprovalExp: 7,
        notifHousekeeping: 30,
      },
      createdBy: adminUser._id,
    });
    await maxParms.save()
    .then(function () {
      console.log("Maximum parameters inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // add default message parameters
    await system_parameter
      .insertMany([
        {
          parameterId: "notification_type",
          notification_type: {
            notifId: "APMDU",
            infoOrApproval: "APRVREJ",
            message: "WIP approval for match details update",
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "notification_type",
          notification_type: {
            notifId: "APTMI",
            infoOrApproval: "APRVREJ",
            message:
              "WIP approval request from team admin to player to join team",
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "notification_type",
          notification_type: {
            notifId: "APTMJ",
            infoOrApproval: "APRVREJ",
            message:
              "WIP approval request from player to team admin to join team",
          },
          createdBy: adminUser._id,
        },
        {
          parameterId: "notification_type",
          notification_type: {
            notifId: "NTFTMJA",
            infoOrApproval: "INFO",
            message:
              "WIP NTFTMJA",
          },
          createdBy: adminUser._id,
        },
      ])
      .then(function () {
        console.log("Default messages data inserted.");
      })
      .catch(function (error) {
        console.log(error);
      });

    // Add regular user (To create team)
    saltVal = genSalt();
    passVal = genHash("hpotterpword", saltVal);
    let regularUser1 = new user({
      status: "ACTV",
      userName: "hpotter",
      email: "harry_potter@gmail.com",
      password: passVal,
      salt: saltVal,
      userType: "USER",
      phoneNumber: "",
      firstName: "Harry",
      lastName: "Potter",
      country: "CA",
      province: "ON",
      city: "Toronto",
      sportsOfInterest: [basket._id],
      successfulLoginDetails: [
        {
          sourceIPAddress: "194.120.180.275",
          timestamp: getTimestamp(0),
        },
      ],
      failedLoginDetails: {
        numberOfLoginTries: 8,
        numberOfFailedLogins: 1,
        failedLogins: [
          {
            sourceIPAddress: "194.120.180.275",
            timestamp: getTimestamp(0),
          },
        ],
        consecutiveLockedOuts: 0,
        lockedTimestamp: null,
      },
      detailsOTP: {
        OTP: 123456,
        expiryTimeOTP: getTimestamp(9),
      },
    });
    await regularUser1.save()
    .then(function () {
      console.log("User 1 inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add regular user (To create league)
    saltVal = genSalt();
    passVal = genHash("hGrangerpword", saltVal);
    let regularUser2 = new user({
      status: "ACTV",
      userName: "hgranger",
      email: "hermione_granger@gmail.com",
      password: passVal,
      salt: saltVal,
      userType: "USER",
      firstName: "Hermione",
      lastName: "Granger",
      country: "CA",
      province: "ON",
      city: "Toronto",
      sportsOfInterest: [basket._id],
      successfulLoginDetails: [
        {
          sourceIPAddress: "194.120.180.275",
          timestamp: getTimestamp(0),
        },
      ],
    });
    await regularUser2.save()
    .then(function () {
      console.log("User 2 inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add regular user (To join team)
    saltVal = genSalt();
    passVal = genHash("rWeasleypword", saltVal);
    let regularUser3 = new user({
      status: "ACTV",
      userName: "rweasley",
      email: "ronald_weasley@gmail.com",
      password: passVal,
      salt: saltVal,
      userType: "USER",
      firstName: "Ronald",
      lastName: "Weasley",
      country: "CA",
      province: "ON",
      city: "Toronto",
      sportsOfInterest: [basket._id, soccer._id],
      successfulLoginDetails: [
        {
          sourceIPAddress: "194.120.180.275",
          timestamp: getTimestamp(0),
        },
      ],
    });
    await regularUser3.save()
    .then(function () {
      console.log("User 3 inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add regular user (To join team)
    saltVal = genSalt();
    passVal = genHash("gWeasleypword", saltVal);
    let regularUser4 = new user({
      status: "ACTV",
      userName: "gweasley",
      email: "ginny_weasley@gmail.com",
      password: passVal,
      salt: saltVal,
      userType: "USER",
      firstName: "Ginny",
      lastName: "Weasley",
      country: "CA",
      province: "ON",
      city: "Toronto",
      sportsOfInterest: [basket._id],
      successfulLoginDetails: [
        {
          sourceIPAddress: "194.120.180.275",
          timestamp: getTimestamp(0),
        },
      ],
    });
    await regularUser4.save()
    .then(function () {
      console.log("User 4 inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Add first team
    await user.updateOne({ _id : regularUser1._id}, { 
      $push: { teamsCreated: {
        teamName: "Gryffindor",
        location: "Hogsmeade Ave., Toronto, ON",
        division: "boys",
        teamContactEmail: "gryffindor@gmail.com",
        description: "The brave ones",
        sportsTypeId: basket._id,
        lookingForPlayers: false,
        lookingForPlayersChgTmst: getTimestamp(0),
      } } 
    })
    .then(function () {
      console.log("Team 1 created by user 1.");
    })
    .catch(function (error) {
      console.log(error);
    });
    let user1 = await user.findOne({ _id : regularUser1._id }).exec();
    let team1 = user1.teamsCreated;
    let index1 = team1.findIndex(team => team.teamName == "Gryffindor")

    // Add second team
    await user.updateOne({ _id : regularUser1._id}, { 
      $push: { teamsCreated: {
        teamName: "Ravenclaw",
        location: "Hogsmeade Ave., Toronto, ON",
        division: "boys",
        teamContactEmail: "ravenclaw@gmail.com",
        description: "The wise ones",
        sportsTypeId: basket._id,
        lookingForPlayers: false,
        lookingForPlayersChgTmst: getTimestamp(0),
      } } 
    })
    .then(function () {
      console.log("Team 2 created by user 1.");
    })
    .catch(function (error) {
      console.log(error);
    });
    user1 = await user.findOne({ _id : regularUser1._id }).exec();
    let team2 = user1.teamsCreated;
    let index2 = team2.findIndex(team => team.teamName == "Ravenclaw")

    let aptmj = await system_parameter.findOne({ parameterId: "notification_type", "notification_type.notifId": "APTMJ"}).exec();

    // User3 sends request to join team 1
    await user.updateOne({ _id : regularUser3._id }, { 
      $push: { requestsSent : {
        requestType: aptmj,
        requestStatus: "PEND",
        minimumApprovals: 1,
        approvalsCounter: 0,
        receiverTeamId: team1[index1]._id,
      } } 
    })
    .then(function () {
      console.log("User 3 sent request to join team 1.");
    })
    .catch(function (error) {
      console.log(error);
    });
    let user3 = await user.findOne({ _id : regularUser3._id }).exec();
    let sent1 = user3.requestsSent;
    let senti = sent1.findIndex(sent => sent.requestType.toString == aptmj._id.toString )

    // User1 gets notified of request to join team
    await user.updateOne({ _id : regularUser1._id }, { 
      $push: { notifications : {
        readStatus: false,
        notificationType: aptmj,
        senderUserId: regularUser3._id,
        forAction: {
          requestId: sent1[senti]._id,
        }
      } } 
    })
    .then(function () {
      console.log("User1 gets notified of request to join team");
    })
    .catch(function (error) {
      console.log(error);
    });
    user1 = await user.findOne({ _id : regularUser1._id }).exec();
    let notif1 = user1.notifications;
    let notifi = notif1.findIndex(notif => notif.notificationType.toString == aptmj._id.toString )

    // User 3 is accepted into team 1
    await user.updateOne({ _id : regularUser1._id, "notifications._id" : notif1[notifi]._id }, {
      "notifications.$[n1].readStatus": true,
      "notifications.$[n1].forAction": {
          actionDone: "APRV",
          actionTimestamp: getTimestamp(0),
      }
    }, {
      arrayFilters: [
        { "n1._id": notif1[notifi]._id }
      ]
    })
    .then(function () {
      console.log("User1 accepts user3's request.");
    })
    .catch(function (error) {
      console.log(error);
    });

    await user.updateOne({ _id : regularUser3._id, "requestsSent._id" : sent1[senti].id }, { 
      "requestsSent.$[n1].requestStatus": "APRV",
      "requestsSent.$[n1].approvalsCounter": 1
    }, {
        arrayFilters: [
      { "n1._id": sent1[senti]._id }
    ]
  })
    .then(function () {
      console.log("User 3 request gets updated to APRV.");
    })
    .catch(function (error) {
      console.log(error);
    });

    let ntftmja = await system_parameter.findOne({ parameterId: "notification_type", "notification_type.notifId": "NTFTMJA"}).exec();
    // User 3 gets notified of approval
    await user.updateOne({ _id : regularUser3._id }, { 
      $push: { notifications : {
        readStatus: false,
        notificationType: ntftmja._id,
        senderUserId: regularUser1._id,
        senderTeamId: team1[index1]._id,
      } } 
    })
    .then(function () {
      console.log("User3 gets notified of acceptance to join team");
    })
    .catch(function (error) {
      console.log(error);
    });

    // User 4 is added into team 2
    await user.updateOne({ _id : regularUser1._id, "teamsCreated._id" : team2[index2]._id }, { 
      $push: { "teamsCreated.$.players" : {
        playerId: regularUser4._id,
        joinedTimestamp: getTimestamp(0),
      } } 
    })
    .then(function () {
      console.log("User 4 is added into team 2.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // User 3 is added into team 1
    await user.updateOne({ _id : regularUser1._id, "teamsCreated._id" : team1[index1]._id }, { 
      $push: { "teamsCreated.$.players" : {
        playerId: regularUser3._id,
        joinedTimestamp: getTimestamp(0),
      } } 
    })
    .then(function () {
      console.log("User 3 is added into team 1.");
    })
    .catch(function (error) {
      console.log(error);
    });

    let bbp01 = await system_parameter.findOne({ parameterId: "position", "position.positionId": "BBP01"}).exec();
    // User 3 is team captain
    await user.updateOne({ _id : regularUser1._id }, { 
      $set: {"teamsCreated.$[n1].players.$[n2].position": bbp01._id,
      "teamsCreated.$[n1].players.$[n2].jerseyNumber": 1,}
    }, {
      arrayFilters: [
        { "n1._id": team1[index1]._id },
        { "n2.playerId": regularUser3._id }
    ]
    })
    .then(function () {
      console.log("User 3 is team captain.");
    })
    .catch(function (error) {
      console.log(error);
    });
    
    // Add first league
    let league1 = new league({
      leagueName: "Hogsmeade League 2023",
      status: "NS",
      location: "Hogsmeade Ave., Toronto, ON",
      division: "boys",
      description: "Friendly league in Hogsmeade Ave",
      sportsTypeId: basket._id,
      ageGroup: "9-12",
      numberOfTeams: 5,
      numberOfRounds: 1,
      startDate: getTimestamp(1),
      endDate: getTimestamp(30),
      lookingForTeams: false,
      lookingForTeamsChgBy: regularUser2._id,
      lookingForTeamsChgTmst: getTimestamp(0),
      createdBy: regularUser2._id,
    });
    await league1.save()
    .then(function () {
      console.log("League 1 created.");
    })
    .catch(function (error) {
      console.log(error);
    });

    // Team 1 joins league
    await league.updateOne({ _id : league1._id}, { 
      $push: { teams: {
        teamId: team1[index1]._id,
        approvedBy: regularUser2._id,
        joinedTimestamp: getTimestamp(0),
      } } 
    })
    .then(function () {
      console.log("Team 1 joins league 1.");
    })
    .catch(function (error) {
      console.log(error);
    });

    function genSalt() {
      return crypto.randomBytes(16).toString("base64");
    }

    function genHash(password, salt) {
      return createHash("sha256")
        .update(password)
        .update(createHash("sha256").update(salt, "utf8").digest("hex"))
        .digest("hex");
    }

    function getTimestamp(daysToAdd) {
      let date = new Date();
      date.setDate(date.getDate() + daysToAdd);
      return date;
    }

  } finally {
    await mongoose.connection.close(); // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);
