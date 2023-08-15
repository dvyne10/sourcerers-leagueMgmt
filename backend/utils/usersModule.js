import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";

import { genHash, genSalt } from "./auth.utils.js";
import { isValidPassword } from "../controllers/userController.js";
import { getUsersTeams, getTeamsCreated, } from "./teamsModule.js";
import { getLeagueDetails, getLeaguesCreated, getTeamActiveLeagues } from "./leaguesModule.js";
import { hasPendingRequest } from "./requestsModule.js";
import { getSportsList, getSportName, getSysParmById } from "./sysParmModule.js";

let ObjectId = mongoose.Types.ObjectId;
const userStatus = [ {desc: "Active", code: "ACTV"}, {desc: "Banned", code: "BAN"},
        {desc: "Suspended", code: "SUSP"}, {desc: "Locked", code: "LOCK"}, {desc: "Pending", code: "PEND"} ]

export const getPlayers = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let users = await UserModel.aggregate([
        {
            $match: {
                userType: "USER", status: "ACTV"
            }
        },
        {
            $addFields: {
                playerId: "$_id",
                fullName: {
                    $reduce: {
                        input: [ "$firstName", " ", "$lastName" ],
                        initialValue: "",
                        in: {
                            $concat: [ "$$value", "$$this"]
                        }
                    }
                }, 
                location: {
                    $concat: [ 
                        {$cond : [
                            { $eq : [ "$city", "N/A" ] },  "" , "$city"
                        ]}, 
                        " ", 
                        {$cond : [
                            { $eq : [ "$province", "N/A" ] },  "" , "$province"
                        ]}, 
                        " ", 
                        {$cond : [
                            { $eq : [ "$country", "N/A" ] },  "" , "$country"
                        ]}, 
                    ]
                },
            },
        },
        {
            $project: {
                _id: 0, playerId: 1, fullName: 1, location : 1, sports: "$sportsOfInterest"
            }
        }
    ])
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (users.length === 0) {
        response.requestStatus = "ACTC"
        response.errMsg = "No data found"
        response.details = []
        return response
    }

    let sportsList = []
    let sportsParms = await getSportsList()
    if (sportsParms.requestStatus === 'ACTC') {
        sportsList = sportsParms.data
    }

    let resp1, resp2, wins, userString, sportsName, sportIndex
    const promises1 = users.map(async function(user) {
        wins = await getUserWinsCount(user.playerId.toString())
        if (wins > 0) {
            return {...user, wins }
        }
    })
    const usersWithWins = await Promise.all(promises1);
    const top50Players = usersWithWins.sort((a, b) => b.wins - a.wins).slice(0,50)

    const promises2 = top50Players.map(async function(user) {
        userString = user.playerId.toString()
        resp1 = user.sports.map((sport) => {
            sportIndex = sportsList.findIndex((i) => i.sportsId.equals(sport))
            sportsName = sportIndex === -1 ? "" : sportsList[sportIndex].sportsName
            return {sportsTypeId: sport, sportsName}
        })
        resp2 = getUsersTeams(userString)
        let [sports, activeTeams] = await Promise.all([resp1, resp2])
        return {...user, sports, activeTeams }
    })
    const usersWithdetails = await Promise.all(promises2);

    response.requestStatus = "ACTC"
    response.details = usersWithdetails
    return response
}

export const getPlayerDetailsAndButtons = async function(userId, playerId) {

    let playerDetails = await getPlayerDetails(playerId)
    if (playerDetails.requestStatus !== "ACTC") {
        return playerDetails
    }
    
    let resp1 = getUsersTeamsAndLeagues(playerId)
    let resp2 = getTeamsCreated(playerId)
    let resp3 = getUserGamesWinsChamps(playerId)
    let resp4 = getUserStatsTotal(playerId)
    let resp5 = getLeaguesCreated(playerId)
    let resp6 = getPlayerButtons(userId, playerId)

    let [activeTeamsLeagues, teamsCreated, playerMatches, statistics, leaguesCreated, buttons] = await Promise.all([resp1, resp2, resp3, resp4, resp5, resp6])
    playerDetails = {...playerDetails, activeTeams: activeTeamsLeagues.activeTeams, teamsCreated, matches: playerMatches.matches, 
        pastLeagues: playerMatches.pastLeagues, totalGamesPlayed: playerMatches.totalGamesPlayed, wins: playerMatches.wins, 
        championships: playerMatches.championships, activeLeagues: activeTeamsLeagues.activeLeagues, statistics, leaguesCreated, buttons}
    return playerDetails
}

export const getMyProfile = async function(userId) {

    let playerDetails = await getPlayerDetails(userId)
    if (playerDetails.requestStatus !== "ACTC") {
        return playerDetails
    }
    
    let resp1 = getUsersTeamsAndLeagues(userId)  // returns an array
    let resp2 = getTeamsCreated(userId)   // returns an array
    let resp3 = getUserGamesWinsChamps(userId)
    let resp4 = getUserStatsTotal(userId)  //returns an array
    let resp5 = getLeaguesCreated(userId) //returns an array

    let [activeTeamsLeagues, teamsCreated, playerMatches, statistics, leaguesCreated] = await Promise.all([resp1, resp2, resp3, resp4, resp5])
    playerDetails = {...playerDetails, activeTeams: activeTeamsLeagues.activeTeams, teamsCreated, matches: playerMatches.matches, 
            pastLeagues: playerMatches.pastLeagues, totalGamesPlayed: playerMatches.totalGamesPlayed, wins: playerMatches.wins, 
            championships: playerMatches.championships, activeLeagues: activeTeamsLeagues.activeLeagues, statistics, leaguesCreated}
    return playerDetails
}

export const getPlayerDetails = async function(playerId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(playerId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }
 
    let player = await UserModel.aggregate([ { $match : { _id : new ObjectId(playerId), userType: "USER", status : {$ne : "PEND"} } },
        { 
            $addFields: {
                playerId: "$_id", 
                fullName: {
                    $reduce: {
                        input: [ "$firstName", " ", "$lastName" ],
                        initialValue: "",
                        in: {
                            $concat: [ "$$value", "$$this"]
                        }
                    }
                },
                location: {
                    $concat: [ 
                        {$cond : [
                            { $eq : [ "$city", "N/A" ] },  "" , "$city"
                        ]}, 
                        " ", 
                        {$cond : [
                            { $eq : [ "$province", "N/A" ] },  "" , "$province"
                        ]}, 
                        " ", 
                        {$cond : [
                            { $eq : [ "$country", "N/A" ] },  "" , "$country"
                        ]}, 
                    ]
                },
            }, 
        }, { 
            $project: {
                _id: 0, playerId : 1, status : 1, fullName: 1, userName: 1, 
                email : 1, phoneNumber: 1, location: 1, sports: "$sportsOfInterest"
            }
        }
    ]).limit(1)
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (player.length === 0) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    player = player[0]
    let idx = userStatus.findIndex(i => i.code === player.status)
    let statusDesc = idx !== -1 ? userStatus[idx].desc : ""
    
    let sportsName
    let promise = player.sports.map(async function(sport) {
        sportsName = await getSportName(sport.toString())
        return { sportsTypeId: sport, sportsName}
    })
    const withSportsName  = await Promise.all(promise)

    const playerDetails = {...player, sports: withSportsName, statusDesc}
    
    response.requestStatus = "ACTC"
    response.details = playerDetails
    return response
}

export const getPlayerButtons = async function(userId, playerId) {
    let response = { displayInviteToTeamButton: false, teamsCreated: [],  displayUninviteToTeamButton: false, pendingInviteRequestId : "", 
        teamNamePlayerIsInvitedTo: "" }

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(playerId.trim())) {
        return response
    }
    
    let inviteToTeam = await hasPendingRequest("APTMI", userId, playerId, "", "")
    if (inviteToTeam !== null && inviteToTeam.requestStatus === "ACTC") {
        if (inviteToTeam.hasPending === false && inviteToTeam.teamsCreated.length > 0) {
            response.displayInviteToTeamButton = true
            response.teamsCreated = inviteToTeam.teamsCreated
        }
        if (inviteToTeam.hasPending === true) {
            response.displayUninviteToTeamButton = true
            response.pendingInviteRequestId = inviteToTeam.pendingInviteRequestId
            response.teamNamePlayerIsInvitedTo = inviteToTeam.teamNamePlayerIsInvitedTo
        }
    }

    return response
}

export const getUserWinsCount = async function(playerId) {
    let wins = 0
    let userGames = await LeagueModel.aggregate([
        {
            $match: {
                $or : [{ "matches.team1.players.playerId" : new ObjectId(playerId)} , {"matches.team2.players.playerId" : new ObjectId(playerId) }]
            }
        },
        {
            $addFields: {
                wins: {
                    $map: {
                        input: "$matches",
                        as: "match",
                        in: {
                            $cond : [{
                                $anyElementTrue: {
                                    $map: {
                                        input: "$$match.team1.players",
                                        in: { $eq : [ "$$this.playerId", new ObjectId(playerId) ] }
                                    }
                                }
                            },
                            { 
                                $cond : [ { $gt : [ "$$match.team1.leaguePoints", "$$match.team2.leaguePoints" ] }, 1, 0]
                            },
                            {$cond : [
                                {
                                    $anyElementTrue: {
                                        $map: {
                                            input: "$$match.team2.players",
                                            in: { $eq : [ "$$this.playerId", new ObjectId(playerId) ] }
                                        }
                                    }
                                },
                                {
                                    $cond : [ { $gt : [ "$$match.team2.leaguePoints", "$$match.team1.leaguePoints" ] }, 1, 0]
                                },
                                0
                            ]}
                            ]
                        }
                    }
                }
            }
        }, {
            $project : { _id : 0, wins: 1 }
        }
    ])

    userGames.map((league) => {
        league.wins.map((match) => {
            wins += match
        })
    })
    
    return wins
}

export const getUserGamesWinsChamps = async function(playerId) {
    let matches = []
    let pastLeagues = []
    let totalGamesPlayed = 0
    let wins = 0
    let championships = 0
    let teams = []
    let playerTeam, teamMatches, item1, item2, teamName1, teamName2, leagueDetails, match, leagueWinner

    let games = await getUsersGames(playerId)
    if (games.length === 0) {
        return {matches, pastLeagues, totalGamesPlayed, wins, championships}
    }
    const promises = await games.map(async (league) => {
        leagueDetails = await getLeagueDetails(league.leagueId.toString())
        if (league.status === "EN") {
            pastLeagues.push({ leagueId: league.leagueId, leagueName: league.leagueName, sportsTypeId: league.sportsTypeId, 
                location: league.location, startDate: league.startDate, endDate: league.endDate })
            leagueWinner = leagueDetails.details.teams[0].teamId
            playerTeam = null
        }
        teams = leagueDetails.details.teams
        teamMatches = league.matches.map(async (cur) => {
            item1 = teams.findIndex(team => team.teamId.equals(cur.team1.teamId))
            item2 = teams.findIndex(team => team.teamId.equals(cur.team2.teamId))
            teamName1 = teams[item1].teamName
            teamName2 = teams[item2].teamName
            if (cur.playerTeam.teamNo === 1 || cur.playerTeam.teamNo === 2) {
                match = {...cur}
                match.team1.teamName = teamName1
                match.team2.teamName = teamName2
                matches.push(match)
                cur.playerTeam.won === true ? (wins += 1) : 0
                totalGamesPlayed += 1
                if (playerTeam === null && league.status === "EN") {
                    if (cur.playerTeam.teamNo === 1 ) {
                        playerTeam = cur.team1.teamId
                    } else {
                        playerTeam = cur.team2.teamId
                    }
                    if (leagueWinner.equals(playerTeam)) {
                        championships += 1
                    }
                }
            }
        })
        await Promise.all(teamMatches)
    })
    await Promise.all(promises);
    return { matches, pastLeagues, totalGamesPlayed, wins, championships }
}

export const getUsersGames = async function(playerId) {
    let userGames = await LeagueModel.aggregate([
        {
            $match: {
                $or : [{ "matches.team1.players.playerId" : new ObjectId(playerId)} , {"matches.team2.players.playerId" : new ObjectId(playerId) }]
            }
        },
        {
            $addFields: {
                matchesFiltered: {
                    $map: {
                        input: "$matches",
                        as: "match",
                        in: {
                            matchId: "$$match._id",
                            dateOfMatch: "$$match.dateOfMatch",
                            locationOfMatch: "$$match.locationOfMatch",
                            team1 : {
                                teamId: "$$match.team1.teamId",
                                finalScore: "$$match.team1.finalScore",
                                finalScorePending: "$$match.team1.finalScorePending",
                                leaguePoints: "$$match.team1.leaguePoints",
                                leaguePointsPending: "$$match.team1.leaguePoints"
                            },
                            team2 : {
                                teamId: "$$match.team2.teamId",
                                finalScore: "$$match.team2.finalScore",
                                finalScorePending: "$$match.team2.finalScorePending",
                                leaguePoints: "$$match.team2.leaguePoints",
                                leaguePointsPending: "$$match.team2.leaguePoints"
                            },
                            playerTeam: {
                                $cond : [{
                                    $anyElementTrue: {
                                        $map: {
                                            input: "$$match.team1.players",
                                            in: { $eq : [ "$$this.playerId", new ObjectId(playerId) ] }
                                        }
                                    }
                                },
                                { teamNo: 1, won : {
                                    $cond : [ { $gt : [ "$$match.team1.leaguePoints", "$$match.team2.leaguePoints" ] }, true, false]
                                } },
                                {$cond : [
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$$match.team2.players",
                                                in: { $eq : [ "$$this.playerId", new ObjectId(playerId) ] }
                                            }
                                        }
                                    },
                                    { teamNo: 2, won : {
                                        $cond : [ { $gt : [ "$$match.team2.leaguePoints", "$$match.team1.leaguePoints" ] }, true, false]
                                    } },
                                    0
                                ]}
                                ]
                            }
                        }
                    }
                }
            }
        }, {
            $project : { _id : 0, leagueId: "$_id", leagueName: 1, sportsTypeId : 1, status: 1,
            location : 1, startDate : 1, endDate : 1, matches: "$matchesFiltered" }
        }
    ])
    return userGames
}

export const getUserStatsTotal = async function(playerId) {
    let userStats = await getUserStats(playerId)
    if (userStats.length === 0) {
        return []
    }
    let sportStat = []
    let totalStat = []
    let sportsName, statParm, itemSport, itemStat
    const promises = await userStats.reduce(async (sportStat, cur) => {
        let leagueStat = await cur.playerStats.reduce(async (init, cur) => {
            sportStat = await init
            itemSport = await sportStat.find(({ sportsTypeId }) => sportsTypeId.equals(cur.sportsTypeId))
            if (itemSport) {
                totalStat = itemSport.stats
            } else {
                sportsName = await getSportName(cur.sportsTypeId.toString())
                sportStat.push({ sportsTypeId: cur.sportsTypeId, sportsName, stats: [] })
                itemSport = sportStat.find(({ sportsTypeId }) => sportsTypeId.equals(cur.sportsTypeId))
                totalStat = []
            }
            let matchStat = await cur.stat.reduce(async (init, cur) => {
                totalStat = await init
                itemStat = await totalStat.find(({ statisticsId }) => statisticsId.equals(cur.statisticsId))
                if (itemStat) {
                    itemStat.totalValue += cur.value 
                } else {
                    statParm = await getSysParmById(cur.statisticsId.toString())
                    if (statParm !== "" && statParm.statistic !== null) {
                        totalStat.push({ statisticsId: cur.statisticsId, statShortDesc: statParm.statistic.statShortDesc, 
                                    statLongDesc: statParm.statistic.statLongDesc, totalValue: cur.value })
                    }
                }
                return totalStat
            }, Promise.resolve(totalStat)) 
            itemSport.stats = matchStat
            return sportStat
        }, Promise.resolve(sportStat)) 
        return leagueStat
    }, Promise.resolve(sportStat))  
    await Promise.all(promises)
    return sportStat
}

export const getUserStats = async function(playerId) {
    let userStats = await LeagueModel.aggregate([
        {
            $match: {
                $or : [{ "matches.team1.players.playerId" : new ObjectId(playerId)} , {"matches.team2.players.playerId" : new ObjectId(playerId) }]
            }
        },
        {
            $project : {
                playerStats : {
                    $map : {
                        input: "$matches",
                        as: "match",
                        in: {
                            matchId: "$$match._id",
                            leagueId: "$_id",
                            sportsTypeId: "$sportsTypeId",
                            teamId1: "$$match.team1.teamId",
                            team1: {
                                $filter : {
                                    input: "$$match.team1.players",
                                    as: "player",
                                    cond: { 
                                        $eq : [ "$$player.playerId", new ObjectId(playerId) ]
                                    }
                                } 
                            }, 
                            teamId2: "$$match.team2.teamId",
                            team2: {
                                $filter : {
                                    input: "$$match.team2.players",
                                    as: "player",
                                    cond: { 
                                        $eq : [ "$$player.playerId", new ObjectId(playerId) ]
                                    }
                                }
                            } 
                        }
                    }
                }
            }
        },
        {
            $project : {
                playerStats : {
                    $map : {
                        input: "$playerStats",
                        as: "player",
                        in: {
                            $cond : [
                                { $ne : [ "$$player.team1", [] ] },
                                { 
                                    matchId: "$$player.matchId",
                                    leagueId: "$$player.leagueId",
                                    sportsTypeId: "$$player.sportsTypeId",
                                    teamId: "$$player.teamId1",
                                    stat: { $arrayElemAt : [ "$$player.team1.statistics" , 0] },
                                },
                                { $cond : [
                                    { $ne : [ "$$player.team2", [] ] } ,
                                    { 
                                        matchId: "$$player.matchId",
                                        leagueId: "$$player.leagueId",
                                        sportsTypeId: "$$player.sportsTypeId",
                                        teamId: "$$player.teamId2",
                                        stat: { $arrayElemAt : [ "$$player.team2.statistics" , 0] },
                                    },
                                    "X"
                                ]}
                            ]
                        }
                    } ,
                }, _id :0
            }
        },
        {
            $project : {
                playerStats : {
                    $filter : {
                        input: "$playerStats",
                        as: "stat",
                        cond: {
                            $ne : [ "$$stat", "X"],
                        }
                    } ,
                }
            }
        }
    ])

    return userStats
}

export const getUsersTeamsAndLeagues = async function(userId) {
    let activeTeams = []
    let activeLeagues = []
    if (!mongoose.isValidObjectId(userId.trim())) {
        return { activeTeams, activeLeagues }
    }
    let teams = await UserModel.find({"teamsCreated.players.playerId"  : new ObjectId(userId)}, { _id: 0, teamsCreated : 1})
    if (teams !== null && teams.length > 0) {
        for (let i=0; i < teams.length; i++) {
            for (let j=0; j < teams[i].teamsCreated.length; j++) {
                for (let k=0; k < teams[i].teamsCreated[j].players.length; k++) {
                    if (teams[i].teamsCreated[j].players[k].playerId.equals(new ObjectId(userId))) {
                        let resp1 = getSportName(teams[i].teamsCreated[j].sportsTypeId.toString())
                        let resp2 = getTeamActiveLeagues(teams[i].teamsCreated[j]._id.toString())
                        let [sportsName, activeLeaguesOfTeam] = await Promise.all([resp1, resp2])
                        activeTeams.push({teamId : teams[i].teamsCreated[j]._id, teamName : teams[i].teamsCreated[j].teamName, 
                            sportsTypeId: teams[i].teamsCreated[j].sportsTypeId, sportsName: sportsName,
                            jerseyNumber: teams[i].teamsCreated[j].players[k].jerseyNumber
                        })
                        activeLeaguesOfTeam.map(league => {
                            activeLeagues.push({...league, sportsName})
                        })
                    }
                }
            }
        }
    }
    return { activeTeams, activeLeagues }
}

export const getUserFullname = async function(playerId, userName) {

    if ((playerId !== "" && !mongoose.isValidObjectId(playerId.trim())) || (playerId == "" && userName.trim() === "")) {
        return {playerId: "", userName: "", fullName: ""}
    }
    let user
    if (mongoose.isValidObjectId(playerId.trim())) {
        user = await UserModel.aggregate([
            {
                $match: { _id : new ObjectId(playerId) }
            },
            {
                $addFields: {
                    playerId: "$_id",
                    fullName: {
                        $reduce: {
                            input: [ "$firstName", " ", "$lastName" ],
                            initialValue: "",
                            in: {
                                $concat: [ "$$value", "$$this"]
                            }
                        }
                    }
                },
            },
            {
                $project: {
                    _id: 0, playerId: 1, fullName: 1, userName: 1
                }
            }
        ]).limit(1)
    } else {
        user = await UserModel.aggregate([
            {
                $match: { userName: new RegExp(`^${userName}$`, "i") }
            },
            {
                $addFields: {
                    playerId: "$_id",
                    fullName: {
                        $reduce: {
                            input: [ "$firstName", " ", "$lastName" ],
                            initialValue: "",
                            in: {
                                $concat: [ "$$value", "$$this"]
                            }
                        }
                    }
                },
            },
            {
                $project: {
                    _id: 0, playerId: 1, fullName: 1, userName: 1
                }
            }
        ]).limit(1)
    }
    if (user.length === 0) {
        return {playerId: "", userName: "", fullName: ""}
    } else {
        return {playerId: user[0].playerId, userName: user[0].userName, fullName: user[0].fullName}
    }
}

export const getAccountDetailsUpdate = async function(userId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }

    let user = await UserModel.findOne({ _id : new ObjectId(userId), userType : "USER", status : "ACTV"}, {
        _id: 1, userName: 1, email: 1, phoneNumber: 1, firstName: 1, lastName: 1, country: 1, province: 1, city: 1, sportsOfInterest: 1
    })

    if (user === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }
    
    response.requestStatus = "ACTC"
    response.details = user
    return response
}

export const updateAccount = async function(userId, details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }

    const existingUsername = await UserModel.findOne({ userName: new RegExp(`^${details.userName}$`, "i") });
    if (existingUsername !== null && !existingUsername._id.equals(new ObjectId(userId))) {
        response.requestStatus = "RJCT"
        response.errMsg = "The username is not available"
        return response
    }

    let user = await UserModel.updateOne({ _id : new ObjectId(userId), userType : "USER", status : "ACTV"}, {
        $set: { 
            userName: details.userName.trim(),
            phoneNumber: details.phoneNumber.trim(),
            firstName: details.firstName.trim(),
            lastName: details.lastName.trim(),
            country: details.country.trim(),
            province: details.province.trim(),
            city: details.city.trim(),
            sportsOfInterest: details.sportsOfInterest,
        } 
    })
    if (user.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Account update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

export const changePassword = async function(userId, details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }

    if (details.currentPassword === "") {
        response.requestStatus = "RJCT"
        response.errField = "currentPassword"
        response.errMsg = "Current password is required."
        return response
    }
    if (details.newPassword === "") {
        response.requestStatus = "RJCT"
        response.errField = "newPassword"
        response.errMsg = "New password is required."
        return response
    }
    if (details.currentPassword === details.newPassword) {
        response.requestStatus = "RJCT"
        response.errField = "newPassword"
        response.errMsg = "Current and new passwords cannot be the same."
        return response
    }
    if (details.confirmNewPassword === "") {
        response.requestStatus = "RJCT"
        response.errField = "confirmNewPassword"
        response.errMsg = "Confirm new password is required."
        return response
    }
    if (details.newPassword !== details.confirmNewPassword) {
        response.requestStatus = "RJCT"
        response.errField = "confirmNewPassword"
        response.errMsg = "New password and confirm new password must be the same."
        return response
    }

    const userDetails = await UserModel.findOne({ _id : new ObjectId(userId), userType : "USER", status : "ACTV" }, { password: 1, salt: 1});
    if (userDetails === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid user"
        return response
    }

    let hashedPassword = genHash(details.currentPassword, userDetails.salt);
    if (hashedPassword !== userDetails.password) {
        response.requestStatus = "RJCT"
        response.errField = "currentPassword"
        response.errMsg = "Incorrect current password"
        return response
    }

    let passwordCheck = await isValidPassword(details.newPassword)
    if (!passwordCheck.valid) {
        response.requestStatus = "RJCT"
        response.errField = "newPassword"
        response.errMsg = passwordCheck.errMsg
        return response
    }

    const newSalt = genSalt();
    hashedPassword = genHash(details.newPassword, newSalt)
    let user = await UserModel.updateOne({ _id : new ObjectId(userId), userType : "USER", status : "ACTV"}, {
        $set: { 
            password: hashedPassword,
            salt: newSalt,
        } 
    })
    if (user.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Password update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

export const unlockAccounts = async function() {
    await UserModel.updateMany({ status : "LOCK", "failedLoginDetails.lockedTimestamp" : { $lte : new Date()} }, {
        $set: { 
            status: "ACTV", 
            "failedLoginDetails.lockedTimestamp": null,
            "failedLoginDetails.numberOfLoginTries": 0, 
            "failedLoginDetails.numberOfFailedLogins": 0
        } 
    })
    return
}

export const deletePendingAccounts = async function() {
    const currDate = new Date();
    let housekeepDate = currDate.setMinutes(currDate.getMinutes() - 5);
    await UserModel.deleteMany({ status : "PEND", "detailsOTP.expiryTimeOTP" : { $lte : housekeepDate} })
    return
}