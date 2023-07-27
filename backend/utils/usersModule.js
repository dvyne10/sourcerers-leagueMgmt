import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getLeaguesCreated } from "./leaguesModule.js";
import { getUsersTeams } from "./teamsModule.js";
import { getSportsList, getSportName, getNotifParmByNotifId } from "./sysParmModule.js";
import { hasPendingRequest } from "./requestsModule.js";

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
                }
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
        wins = await getUserWins(user.playerId.toString())
        if (wins > 0) {
            return {...user, wins }
        }
    })
    const usersWithWins = await Promise.all(promises1);
    const top50Players = await usersWithWins.sort((a, b) => b.wins - a.wins).slice(0,50)

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

    let player = await getPlayerDetails(playerId)
    if (player.requestStatus !== "ACTC") {
        return player
    }
    
    let resp1 = getUsersTeams(playerId)
    let resp2 = getTeamsCreated(playerId)
    let resp3 = getGameHistory(playerId)
    let resp4 = getLeaguesCreated(playerId)

    if (userId !== null && userId.trim() !== "") {
        
        //playerButtons = getPlayerButtons(userId, playerId)


        let [leagueDetails, leagueButtonsInd] = await Promise.all([league, leagueButtons])
        if (leagueDetails.requestStatus !== "ACTC") {
            return leagueDetails
        } else {
            leagueDetails = {...leagueDetails, buttons: leagueButtonsInd}
            return leagueDetails
        }
    } else {


        league = await getLeagueDetails(leagueId)
        return league
    }
}

export const getPlayerDetails = async function(playerId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (playerId === null || playerId.trim() === "") {
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
    let idx = await userStatus.findIndex(i => i.code === player.status)
    let statusDesc = idx !== -1 ? userStatus[idx].desc : ""
    
    let sportsName
    let promise = player.sports.map(async function(sport) {
        sportsName = await getSportName(sport.toString())
        console.log(sport + sportsName)
        return { sportsTypeId: sport, sportsName}
    })
    const withSportsName  = await Promise.all(promise)

    const playerDetails = {...player, sports: withSportsName, statusDesc}
    
    response.requestStatus = "ACTC"
    response.details = playerDetails
    console.log(163)
    return response
}

export const getUserWins = async function(playerId) {
    let wins = 0
    let games = await getUsersGames(playerId).catch(() => { return 0 })
    if (games.requestStatus !== "ACTC") {
        return 0
    }
    const promises = games.details.map(async function(league) {
        await league.matches.map((match) => {
            match.playerTeam.won === true ? (wins += 1) : 0
        })
    })
    await Promise.all(promises);
    return wins
}

export const getUsersGames = async function(playerId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
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
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    response.requestStatus = "ACTC"
    response.details = userGames
    return response
}

export const getUserStats = async function(playerId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userStats = await LeagueModel.aggregate([
        {
            $match: {
                $or : [{ "matches.team1.players.playerId" : new ObjectId(playerId)} , {"matches.team2.players.playerId" : new ObjectId(playerId) }]
            }
        },
        {
            $project : {
                filteredPlayers : {
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
                filteredPlayers : {
                    $map : {
                        input: "$filteredPlayers",
                        as: "player",
                        in: {
                            $cond : [
                                { $ne : [ "$$player.team1", [] ] },
                                { 
                                    matchId: "$$player.matchId",
                                    leagueId: "$$player.leagueId",
                                    sportsTypeId: "$$player.sportsTypeId",
                                    teamId: "$$player.teamId1",
                                    statId: { $arrayElemAt : [ { $arrayElemAt : [ "$$player.team1.statistics.statisticsId" , 0] } , 0] },
                                    statValue: { $arrayElemAt : [ { $arrayElemAt : [ "$$player.team1.statistics.value" , 0] } , 0] }
                                },
                                { $cond : [
                                    { $ne : [ "$$player.team2", [] ] } ,
                                    { 
                                        matchId: "$$player.matchId",
                                        leagueId: "$$player.leagueId",
                                        sportsTypeId: "$$player.sportsTypeId",
                                        teamId: "$$player.teamId2",
                                        statId: { $arrayElemAt : [ { $arrayElemAt : [ "$$player.team2.statistics.statisticsId" , 0] } , 0] },
                                        statValue: { $arrayElemAt : [ { $arrayElemAt : [ "$$player.team2.statistics.value" , 0] } , 0] }
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
                filteredPlayers : {
                    $filter : {
                        input: "$filteredPlayers",
                        as: "stat",
                        cond: {
                            $ne : [ "$$stat", "X"],
                        }
                    } ,
                }
            }
        }
    ])
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    response.requestStatus = "ACTC"
    response.details = userStats
    return response
}