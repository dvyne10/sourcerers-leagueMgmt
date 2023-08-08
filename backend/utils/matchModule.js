import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getUserFullname } from "./usersModule.js";
import { getTeamDetails, getTeamAdmin } from "./teamsModule.js";
import { hasPendingRequest } from "./requestsModule.js";
import { getPosnAndStatBySport, getNotifParmByNotifId } from "./sysParmModule.js";

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
        response.requestStatus = "RJCT"
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
        matchDetails.enableUpdateButton = false
        matchDetails.displayUpdateButton = false
        if (matchDetails.leagueStatus === 'ST') {
            if (mongoose.isValidObjectId(userId) && team1Details.details.createdBy.equals(new ObjectId(userId))) {
                matchDetails.team1.isTeamAdmin = true
                matchDetails.displayUpdateButton = true
                if (matchDetails.team1.finalScorePending === null && matchDetails.team1.leaguePointsPending === null &&
                    matchDetails.team2.finalScorePending === null && matchDetails.team2.leaguePointsPending === null) {
                        matchDetails.enableUpdateButton = true
                        matchDetails.displayUpdateButton = false
                }
            } else {
                matchDetails.team1.isTeamAdmin = false
            }
            if (mongoose.isValidObjectId(userId) && team2Details.details.createdBy.equals(new ObjectId(userId))) {
                matchDetails.team2.isTeamAdmin = true
                matchDetails.displayUpdateButton = true
                if (matchDetails.team1.finalScorePending === null && matchDetails.team1.leaguePointsPending === null &&
                    matchDetails.team2.finalScorePending === null && matchDetails.team2.leaguePointsPending === null) {
                        matchDetails.enableUpdateButton = true
                        matchDetails.displayUpdateButton = false
                }
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

export const getMatchDetailsUpdate = async function(userId, matchId, userType) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(matchId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Match id required"
        return response
    }

    if (!mongoose.isValidObjectId(userId.trim()) || (userType !== "ADMIN"  && userType !== "USER")) {
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
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        return response
    }

    if (leagueMatch[0].leagueStatus !== "ST" && userType === "USER") {
        response.requestStatus = "RJCT"
        response.errMsg = "No league match updates allowed"
        return response
    }

    let matchDetails = leagueMatch[0].matches[0]
    matchDetails = {leagueId: leagueMatch[0].leagueId, leagueStatus: leagueMatch[0].leagueStatus, sportsTypeId: leagueMatch[0].sportsTypeId, matchId: matchDetails._id, ...matchDetails }
    if (userType !== "ADMIN") {
        if (matchDetails.team1.finalScorePending && matchDetails.team1.finalScorePending !== null || 
            matchDetails.team1.leaguePointsPending && matchDetails.team1.leaguePointsPending !== null ||
            matchDetails.team2.finalScorePending && matchDetails.team2.finalScorePending !== null || 
            matchDetails.team2.leaguePointsPending && matchDetails.team2.leaguePointsPending !== null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Match has pending changes for approval"
                return response
        }
    }
    let promise1, promise2, promise3, promisea, promiseb
    promise1 = getTeamDetails(matchDetails.team1.teamId.toString())
    promise2 = getTeamDetails(matchDetails.team2.teamId.toString())
    promise3 = getPosnAndStatBySport(matchDetails.sportsTypeId.toString())
    let [team1Details, team2Details, sportDetails] = await Promise.all([promise1, promise2, promise3]);
    if (team1Details.requestStatus === "ACTC" && team2Details.requestStatus === "ACTC") {
        matchDetails.team1.teamName = team1Details.details.teamName
        matchDetails.team2.teamName = team2Details.details.teamName
        matchDetails.sportsName = sportDetails.sport.sportsName
        if (userType === "ADMIN") {
            matchDetails.team1.isTeamAdmin = true
            matchDetails.team2.isTeamAdmin = false
        } else {
            if (matchDetails.leagueStatus === 'ST') {
                if (mongoose.isValidObjectId(userId) && team1Details.details.createdBy.equals(new ObjectId(userId))) {
                    matchDetails.team1.isTeamAdmin = true
                } else {
                    matchDetails.team1.isTeamAdmin = false
                }
                if (mongoose.isValidObjectId(userId) && team2Details.details.createdBy.equals(new ObjectId(userId))) {
                    matchDetails.team2.isTeamAdmin = true
                } else {
                    matchDetails.team2.isTeamAdmin = false
                }
            }
            if (!matchDetails.team1.isTeamAdmin && !matchDetails.team2.isTeamAdmin) {
                response.requestStatus = "RJCT"
                response.errField = "BODY"
                response.errMsg = "Not authorized to this page."
                return response
            }
        }
        promisea = matchDetails.team1.players.map(async (player) => {
            let playerFullname = await getUserFullname(player.playerId.toString(), "")
            return {...player, fullName: playerFullname.fullName, userName: playerFullname.userName}
        })
        promiseb = matchDetails.team2.players.map(async (player) => {
            let playerFullname = await getUserFullname(player.playerId.toString(), "")
            return {...player, fullName: playerFullname.fullName, userName: playerFullname.userName}
        })
        let [team1Players, team2Players] = await Promise.all([Promise.all(promisea), Promise.all(promiseb)]);
        matchDetails.team1.players = team1Players
        matchDetails.team2.players = team2Players
        matchDetails.statisticOptions = sportDetails.stats
    }
    response.requestStatus = "ACTC"
    response.details = matchDetails
    return response
}

export const updateMatch = async function(userId, matchId, data, userType) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    
    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(matchId.trim()) || (userType !== "ADMIN"  && userType !== "USER")) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }
    
    let match = await getMatchDetailsUpdate(userId, matchId, userType)

    if (match.requestStatus !== "ACTC") {
        return match
    }
    let scoresAreChanged = false
    if (data.finalScore1 !== match.details.team1.finalScore || data.finalScore2 !== match.details.team2.finalScore ||
        data.leaguePoints1 !== match.details.team1.leaguePoints || data.leaguePoints2 !== match.details.team2.leaguePoints) {
        scoresAreChanged = true
    }

    let recordUpdated
    if (userType === "ADMIN") {
        recordUpdated = await LeagueModel.updateOne({ "matches._id" : new ObjectId(matchId) }, { 
            $set: { "matches.$[n1].dateOfMatch" : data.dateOfMatch,
                    "matches.$[n1].locationOfMatch" : data.locationOfMatch,
                    "matches.$[n1].team1.finalScore": data.finalScore1,
                    "matches.$[n1].team1.leaguePoints": data.leaguePoints1,
                    "matches.$[n1].team2.finalScore": data.finalScore2,
                    "matches.$[n1].team2.leaguePoints": data.leaguePoints2,
                    "matches.$[n1].team1.finalScorePending": data.finalScorePending1,
                    "matches.$[n1].team1.leaguePointsPending": data.leaguePointsPending1,
                    "matches.$[n1].team2.finalScorePending": data.finalScorePending2,
                    "matches.$[n1].team2.leaguePointsPending": data.leaguePointsPending2,
                    "matches.$[n1].team1.players": data.players1,
                    "matches.$[n1].team2.players": data.players2,
                }
            }, {arrayFilters: [ { "n1._id": new ObjectId(matchId) }] })
    } else {
        if (match.details.team1.isTeamAdmin) {
            recordUpdated = await LeagueModel.updateOne({ "matches._id" : new ObjectId(matchId) }, { 
                $set: { "matches.$[n1].dateOfMatch" : data.dateOfMatch,
                        "matches.$[n1].locationOfMatch" : data.locationOfMatch,
                        "matches.$[n1].team1.finalScorePending": scoresAreChanged ? data.finalScore1 : null,
                        "matches.$[n1].team1.leaguePointsPending": scoresAreChanged ? data.leaguePoints1 : null,
                        "matches.$[n1].team2.finalScorePending": scoresAreChanged ? data.finalScore2 : null,
                        "matches.$[n1].team2.leaguePointsPending": scoresAreChanged ? data.leaguePoints2 : null,
                        "matches.$[n1].team1.players": data.players1,
                    }
                }, {arrayFilters: [ { "n1._id": new ObjectId(matchId) }] })
        } else {
            recordUpdated = await LeagueModel.updateOne({ "matches._id" : new ObjectId(matchId) }, { 
                $set: { "matches.$[n1].dateOfMatch" : data.dateOfMatch,
                        "matches.$[n1].locationOfMatch" : data.locationOfMatch,
                        "matches.$[n1].team1.finalScorePending": scoresAreChanged ? data.finalScore1 : null,
                        "matches.$[n1].team1.leaguePointsPending": scoresAreChanged ? data.leaguePoints1 : null,
                        "matches.$[n1].team2.finalScorePending": scoresAreChanged ? data.finalScore2 : null,
                        "matches.$[n1].team2.leaguePointsPending": scoresAreChanged ? data.leaguePoints2 : null,
                        "matches.$[n1].team2.players": data.players2,
                    }
                }, {arrayFilters: [ { "n1._id": new ObjectId(matchId) }] })
        }
        
    }
    if (recordUpdated.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Match update was not successful"
        return response
    }
    
    if (userType !== "ADMIN" && scoresAreChanged) {      
        let resp1 = getNotifParmByNotifId("APMDU")   // Insert request record
        let resp2 = match.details.team1.isTeamAdmin ? getTeamAdmin(match.details.team2.teamId.toString()) : getTeamAdmin(match.details.team1.teamId.toString())
        let [notif, otherTeamAdmin] = await Promise.all([resp1, resp2])
        await UserModel.updateOne({ _id : new ObjectId(userId) }, { 
            $push: { requestsSent : {
                requestType: notif.data._id,
                requestStatus: "PEND",
                minimumApprovals: 1,
                approvalsCounter: 0,
                receiverUserId: otherTeamAdmin,
                receiverTeamId: match.details.team1.isTeamAdmin ? match.details.team2.teamId : match.details.team1.teamId,
                receiverLeagueId: match.details.leagueId,
            } } 
        })

        // Send notification to other team Id
        let newReq = await UserModel.findOne({ _id : new ObjectId(userId) }, { requestsSent: 1, _id: 0 })
        let index = newReq.requestsSent.length -1
        //Eagles vs Scorpions (Score: null-null Points: null-null
        let parm1 = matchId + "                              "
        let scoreparm1 = data.finalScore1.toString() + "     "
        let scoreparm2 = data.finalScore2.toString() + "     "
        let pointparm1 = data.leaguePoints1.toString() + "     "
        let pointparm2 = data.leaguePoints2.toString() + "     "
        let notifMsg = parm1.substring(0,30) + scoreparm1.substring(0,5) + scoreparm2.substring(0,5) + pointparm1.substring(0,5) + pointparm2.substring(0,5)
        await UserModel.updateOne({ _id : otherTeamAdmin }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: notif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: match.details.team1.isTeamAdmin ? match.details.team1.teamId : match.details.team2.teamId,
                senderLeagueId: match.details.leagueId,
                forAction: {
                    requestId: newReq.requestsSent[index]._id,
                    actionDone: null,
                    actionTimestamp: null
                },
                notificationDetails: notifMsg
            } } 
        })
        
    }
    response.requestStatus = "ACTC"
    return response
}