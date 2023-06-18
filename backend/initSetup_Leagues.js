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

    let soccer = await system_parameter.findOne({ parameterId: "sport", "sport.sportsTypeId": "SOCCER"}, {_id : 1}).exec();
    let stat1 = await system_parameter.findOne({ parameterId: "statistic", "statistic.statisticsId": "SC01"}, {_id : 1}).exec();

    // Add regular user (To create soccer league)
    saltVal = genSalt();
    passVal = genHash("Nr5HrHZganya", saltVal);
    let regularUser1 = new user({
      status: "ACTV",
      userName: "hLawson",
      email: "enim.mauris@hotmail.edu",
      password: passVal,
      salt: saltVal,
      userType: "USER",
      firstName: "Hayes",
      lastName: "Lawson",
      country: "CA",
      province: "ON",
      city: "Toronto",
      sportsOfInterest: [soccer._id],
      successfulLoginDetails: [
        {
          sourceIPAddress: "192.123.360.324",
          timestamp: getTimestamp(0),
        },
      ],
    });
    await regularUser1.save()
    .then(function () {
      console.log("User 1 inserted.");
    })
    .catch(function (error) {
      console.log(error);
    });
    let leagueCreator = await user.findOne({ userName: "hLawson"}, {_id : 1}).exec();

    // Add soccer league
    let league1 = new league({
      leagueName: "York Soccer League 2023",
      status: "EN",
      location: "North York, Toronto, ON",
      division: "mixed",
      description: "Soccer League",
      sportsTypeId: soccer._id,
      ageGroup: "13-16",
      numberOfTeams: 12,
      numberOfRounds: 1,
      startDate: getTimestamp(-1),
      endDate: getTimestamp(30),
      lookingForTeams: false,
      lookingForTeamsChgBy: leagueCreator._id,
      lookingForTeamsChgTmst: getTimestamp(-5),
      createdBy: leagueCreator._id,
    });
    await league1.save()
    .then(function () {
      console.log("League 1 created.");
    })
    .catch(function (error) {
      console.log(error);
    });
    let leagueX = league1._id

    let leagueTeams = [
      await user.findOne({ "teamsCreated.teamName": "Vikings" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Dodgers" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Warriors" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Tigers" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Giants" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Rockets" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Hawks" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Dragons" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Falcons" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Bulls" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Sharks" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Dolphins" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Wolves" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Huskies" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Archers" }, {teamsCreated : 1}).exec(), 
    ]

    await updateLeague(leagueX, leagueCreator, "soccer", "Cheery Beach Sports Fields", stat1, 2);

    let basket = await system_parameter.findOne({ parameterId: "sport", "sport.sportsTypeId": "BASKET"}, {_id : 1}).exec();
    stat1 = await system_parameter.findOne({ parameterId: "statistic", "statistic.statisticsId": "BB01"}, {_id : 1}).exec();

    // Add regular user (To create basketball league)
    saltVal = genSalt();
    passVal = genHash("tKVHg87p4vkh", saltVal);
    let regularUser2 = new user({
      status: "ACTV",
      userName: "bChapman",
      email: "non@google.edu",
      password: passVal,
      salt: saltVal,
      userType: "USER",
      firstName: "Bert",
      lastName: "Chapman",
      country: "CA",
      province: "ON",
      city: "Toronto",
      sportsOfInterest: [basket._id],
      successfulLoginDetails: [
        {
          sourceIPAddress: "174.110.180.295",
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
    leagueCreator = await user.findOne({ userName: "bChapman"}, {_id : 1}).exec();

    // Add basketball league
    let league2 = new league({
      leagueName: "Mississauga League 2023",
      status: "EN",
      location: "Mississauga, ON",
      division: "mixed",
      description: "Basketball League",
      sportsTypeId: basket._id,
      ageGroup: "17-19",
      numberOfTeams: 6,
      numberOfRounds: 1,
      startDate: getTimestamp(-5),
      endDate: getTimestamp(15),
      lookingForTeams: false,
      lookingForTeamsChgBy: leagueCreator._id,
      lookingForTeamsChgTmst: getTimestamp(-5),
      createdBy: leagueCreator._id,
    });
    await league2.save()
    .then(function () {
      console.log("League 2 created.");
    })
    .catch(function (error) {
      console.log(error);
    });
    leagueX = league2._id

    leagueTeams = [
      await user.findOne({ "teamsCreated.teamName": "Eagles" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Scorpions" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Bulldogs" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Spartans" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Wildcats" }, {teamsCreated : 1}).exec(),
      await user.findOne({ "teamsCreated.teamName": "Hyenas" }, {teamsCreated : 1}).exec(),
    ]

  await updateLeague(leagueX, leagueCreator, "basketball", "Kings Court", stat1, 11);

  async function updateLeague(leagueX, leagueCreator, sportsName, gameLocation, stat1, maxScore) {

    //Teams join league
    for (i = 0; i < leagueTeams.length; i++) {
      await league
        .updateOne(
          { _id: leagueX },
          {
            $push: {
              teams: {
                teamId: leagueTeams[i].teamsCreated[0]._id,
                approvedBy: leagueCreator._id,
                joinedTimestamp: getTimestamp(-1),
              },
            },
          }
        )
        .then(function () {
          console.log(`Team ${i + 1} added to ${sportsName} league.`);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    // Matches for league
    let players = [];
    let teamsPlayers = [[]];
    let teamScore = [[]];
    for (i = 0; i < leagueTeams.length; i++) {
      for (j = 0; j < i; j++) {
        teamScore[(i, j)] = 0;
        for (k = 0; k < leagueTeams[i].teamsCreated[0].players.length; k++) {
          players[k] = {
            playerId: leagueTeams[i].teamsCreated[0].players[k].playerId,
            statistics: [
              { statisticsId: stat1._id, value: Math.floor(Math.random() * maxScore) },
            ],
          };
          teamScore[(i, j)] += players[k].statistics[0].value;
        }
        teamsPlayers[(i, j)] = players;
      }
      for (j = i + 1; j < leagueTeams[i].teamsCreated[0].players.length; j++) {
        teamScore[(i, j)] = 0;
        for (k = 0; k < leagueTeams[i].teamsCreated[0].players.length; k++) {
          players[k] = {
            playerId: leagueTeams[i].teamsCreated[0].players[k].playerId,
            statistics: [
              { statisticsId: stat1._id, value: Math.floor(Math.random() * maxScore) },
            ],
          };
          teamScore[(i, j)] += players[k].statistics[0].value;
        }
        teamsPlayers[(i, j)] = players;
      }
    }

    for (i = 0; i < leagueTeams.length; i++) {
      for (j = i + 1; j < leagueTeams.length; j++) {
        leaguePts = teamScore[(i, j)] > teamScore[(j, i)] ? [2, 0] : teamScore[(i, j)] == teamScore[(j, i)] ? [1, 1] : [0, 2];
        await league.updateOne({ _id: leagueX }, {
            $push: {
              matches: {
                dateOfMatch: new Date("2023-06-18T09:00:00Z"),
                locationOfMatch: gameLocation,
                team1: {
                  teamId: leagueTeams[i].teamsCreated[0]._id,
                  finalScore: teamScore[(i, j)],
                  leaguePoints: leaguePts[0],
                  players: teamsPlayers[(i, j)],
                },
                team2: {
                  teamId: leagueTeams[j].teamsCreated[0]._id,
                  finalScore: teamScore[(j, i)],
                  leaguePoints: leaguePts[1],
                  players: teamsPlayers[(j, i)],
                },
                updatedBy: leagueTeams[i]._id,
              },
            },
          }
        );
        console.log(`Team ${i + 1} vs Team ${j + 1} match added for ${sportsName}.`);
      }
    }
  } // End of updateLeague function

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
