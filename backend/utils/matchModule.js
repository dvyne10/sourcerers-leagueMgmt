import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getUserFullname } from "./usersModule.js";
import { getTeamDetails } from "./teamsModule.js";
import { hasPendingRequest } from "./requestsModule.js";
import { getPosnAndStatBySport } from "./sysParmModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const getMatchDetails = async function(userId, matchId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(matchId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Match id required"
        return response
    }

    if (userId && userId.trim() !== "" && !mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid user"
        return response
    }
    
    let leagueMatch = await LeagueModel.aggregate([
        { 
            $match: { "matches._id" : new ObjectId(matchId) } 
        }, 
        { 
            $project: {
                matches: {
                    $filter: {
                        input: "$matches",
                        as: "match",
                        cond: { 
                            $eq: [ "$$match._id", new ObjectId(matchId) ],
                        }
                    }
                }, leagueId: "$_id", _id : 0, leagueStatus : "$status", sportsTypeId : 1
            }
        }
    ]).limit(1)
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (leagueMatch.length === 0) {
        response.requestStatus = "ACTC"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    let matchDetails = leagueMatch[0].matches[0]
    matchDetails = {leagueId: leagueMatch[0].leagueId, leagueStatus: leagueMatch[0].leagueStatus, sportsTypeId: leagueMatch[0].sportsTypeId, matchId: matchDetails._id, ...matchDetails }
    let index, index2, index3, positionParmId, positionId, positionDesc
    let promise1, promise2, promise3, promisea, promiseb, promisec, promised, promisee
    promise1 = getTeamDetails(matchDetails.team1.teamId.toString())
    promise2 = getTeamDetails(matchDetails.team2.teamId.toString())
    promise3 = getPosnAndStatBySport(matchDetails.sportsTypeId.toString())
    let [team1Details, team2Details, sportDetails] = await Promise.all([promise1, promise2, promise3]);
    if (team1Details.requestStatus === "ACTC" && team2Details.requestStatus === "ACTC") {
        matchDetails.team1.teamName = team1Details.details.teamName
        matchDetails.team2.teamName = team2Details.details.teamName
        matchDetails.sportsName = sportDetails.sport.sportsName
        matchDetails.displayUpdateButton = false
        if (matchDetails.leagueStatus === 'ST') {
            if (mongoose.isValidObjectId(userId.trim()) && team1Details.details.createdBy.equals(new ObjectId(userId))) {
                matchDetails.team1.isTeamAdmin = true
                matchDetails.displayUpdateButton = true
            } else {
                matchDetails.team1.isTeamAdmin = false
            }
            if (mongoose.isValidObjectId(userId.trim()) && team2Details.details.createdBy.equals(new ObjectId(userId))) {
                matchDetails.team2.isTeamAdmin = true
                matchDetails.displayUpdateButton = true
            } else {
                matchDetails.team2.isTeamAdmin = false
            }
        }
        promisea = matchDetails.team1.players.map(async (player) => {
            promisec = player.statistics.map(async (stat) => {
                index = sportDetails.stats.findIndex(statParm => statParm.statisticsId.equals(stat.statisticsId))
                if (index !== -1) {
                    return {...stat, statShortDesc : sportDetails.stats[index].statShortDesc, statLongDesc : sportDetails.stats[index].statLongDesc}
                }
            })
            promised = getUserFullname(player.playerId.toString(), "")
            let [playerStat, playerFullname] = await Promise.all([Promise.all(promisec), promised]);
            positionParmId = null, positionId = "", positionDesc = ""
            index2 = team1Details.details.players.findIndex(p => p.playerId.equals(player.playerId))
            if (index2 !== -1 && team1Details.details.players[index2].position) {
                index3 = sportDetails.positions.findIndex(p => p.positionParmId.equals(team1Details.details.players[index2].position))
                if (index3 !== -1) {
                    positionParmId = team1Details.details.players[index2].position
                    positionId = sportDetails.positions[index3].positionId
                    positionDesc = sportDetails.positions[index3].positionDesc
                }
            }
            return {playerId: player.playerId, playerName: playerFullname.fullName, userName: playerFullname.userName, 
                positionParmId, positionId, positionDesc, statistics: playerStat}
        })
        promiseb = matchDetails.team2.players.map(async (player) => {
            promisec = player.statistics.map(async (stat) => {
                index = sportDetails.stats.findIndex(statParm => statParm.statisticsId.equals(stat.statisticsId))
                if (index !== -1) {
                    return {...stat, statShortDesc : sportDetails.stats[index].statShortDesc, statLongDesc : sportDetails.stats[index].statLongDesc}
                }
            })
            promised = getUserFullname(player.playerId.toString(), "")
            let [playerStat, playerFullname] = await Promise.all([Promise.all(promisec), promised]);
            positionParmId = null, positionId = "", positionDesc = ""
            index2 = team2Details.details.players.findIndex(p => p.playerId.equals(player.playerId))
            if (index2 !== -1 && team2Details.details.players[index2].position) {
                index3 = sportDetails.positions.findIndex(p => p.positionParmId.equals(team2Details.details.players[index2].position))
                if (index3 !== -1) {
                    positionParmId = team2Details.details.players[index2].position
                    positionId = sportDetails.positions[index3].positionId
                    positionDesc = sportDetails.positions[index3].positionDesc
                }
            }
            return {playerId: player.playerId, playerName: playerFullname.fullName, userName: playerFullname.userName, 
                positionParmId, positionId, positionDesc, statistics: playerStat}
        })
        promisee = getOtherTwoMatches(matchId, matchDetails.team1.teamId.toString(), matchDetails.team2.teamId.toString())
        let [team1Players, team2Players, pastMatches] = await Promise.all([Promise.all(promisea), Promise.all(promiseb), promisee]);
        matchDetails.team1.players = team1Players
        matchDetails.team2.players = team2Players
        matchDetails.pastMatches = pastMatches
    }
    
    response.requestStatus = "ACTC"
    response.details = matchDetails
    return response
}

export const getOtherTwoMatches = async function(matchId, team1Id, team2Id) {

    if (!mongoose.isValidObjectId(matchId.trim()) || !mongoose.isValidObjectId(team1Id.trim()) || !mongoose.isValidObjectId(team2Id.trim())) {
        return []
    }

    let leagueMatches = await LeagueModel.aggregate([
        { 
            $match: { "matches._id" : { $ne : new ObjectId(matchId) }, 
                    $or : [ {"matches.team1.teamId" : new ObjectId(team1Id)}, {"matches.team1.teamId" : new ObjectId(team2Id)} ] ,
                    $or : [ {"matches.team2.teamId" : new ObjectId(team1Id)}, {"matches.team2.teamId" : new ObjectId(team2Id)} ]
            }
        }, 
        { 
            $project: {
                matches: {
                    $filter: {
                        input: "$matches",
                        as: "match",
                        cond: { $and : [
                                { $ne : [ "$$match._id", new ObjectId(matchId) ] },
                                { $or : [ { $eq : [ "$$match.team1.teamId", new ObjectId(team1Id) ] }, { $eq : [ "$$match.team1.teamId", new ObjectId(team2Id) ] }] },
                                { $or : [ { $eq : [ "$$match.team2.teamId", new ObjectId(team1Id) ] }, { $eq : [ "$$match.team2.teamId", new ObjectId(team2Id) ] }] },
                            ]
                        }
                    }
                }, leagueId: "$_id", _id : 0,
                
            }
        },
        { 
            $project: {
                "matches.team1.players" :0, "matches.team2.players" :0
            }
        },
    ]).limit(2)

    let otherTwoMatches = []
    leagueMatches.map(league => {
        league.matches.map(match => {
            otherTwoMatches.push({leagueId: league.leagueId, matchId: match._id, dateOfMatch: match.dateOfMatch, locationOfMatch: match.locationOfMatch, 
                team1: {teamId: match.team1.teamId, finalScore: match.team1.finalScore, leaguePoints: match.team1.leaguePoints}, 
                team2: {teamId: match.team2.teamId, finalScore: match.team2.finalScore, leaguePoints: match.team2.leaguePoints}
            })
        })
    })
    
    return otherTwoMatches
}

