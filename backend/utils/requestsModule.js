import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getNotifParmByNotifId } from "./sysParmModule.js";
import { getTeamDetails, getTeamsCreated, getUsersTeams } from "./teamsModule.js";
import { getLeagueDetails } from "./leaguesModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const getRequestById = async function(requestId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (requestId === null || requestId === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Request id required"
        return response
    }
    let req = await UserModel.aggregate([ 
        { 
            $match: { 
                "requestsSent._id" : new ObjectId(requestId)
            } 
        }, 
        { 
            $project: {
                requestsSent: {
                    $filter: {
                        input: "$requestsSent",
                        as: "req",
                        cond: { 
                            $eq: [ "$$req._id", new ObjectId(requestId) ]
                        }
                    }
                }, _id : 1
            }
        }
    ]).limit(1)
    if (req === null || req.length === 0) {
        response.requestStatus = "RJCT"
        response.errMsg = "Request is not found."
        return response
    } else {
        let requestor = req[0]._id
        req = req[0].requestsSent[0]
        response.details = { ...req, requestId:requestId, requestedBy : requestor }
        return response
    }
}

export const hasPendingRequest = async function(notifId, userId, playerId, teamId, leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (notifId === null || notifId === "" || (userId === "" && playerId === "" && teamId === "" && leagueId === "")) {
        response.requestStatus = "RJCT"
        response.errMsg = "Entry parameters are required"
        return response
    } else {
        if (notifId === "APTMI") {      // approval request from team admin to player to join team
            if (userId === "" || userId === null || playerId === "" || playerId === null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let parm = await getNotifParmByNotifId(notifId)
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let aptmi = await UserModel.aggregate([ 
                    { 
                        $match: { _id: new ObjectId(userId), "requestsSent.receiverUserId" : new ObjectId(playerId),
                            "requestsSent.requestStatus" : "PEND", "requestsSent.requestType" : parm.data._id
                        } 
                    }, 
                    { 
                        $project: {
                            requestsSent: {
                                $filter: {
                                    input: "$requestsSent",
                                    as: "req",
                                    cond: { $and : [
                                        { $eq: [ "$$req.receiverUserId", new ObjectId(playerId) ] },
                                        { $eq: [ "$$req.requestStatus", "PEND" ] },
                                        { $eq: [ "$$req.requestType", parm.data._id ] },
                                    ]}
                                }
                            }
                        }
                    }
                ]).limit(1)
                if (aptmi === null || aptmi.length === 0) {
                    response.hasPending = false
                    response.teamsCreated = await getTeamsCreated(userId)
                    response.requestStatus = "ACTC"
                    return response
                } else {
                    response.hasPending = true
                    response.pendingInviteRequestId = aptmi[0].requestsSent[0]._id
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }

        if (notifId === "APTMJ") {      // approval request from player to team admin to join team
            if (userId === "" || userId === null || teamId === "" || teamId === null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let parm = await getNotifParmByNotifId(notifId)
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let aptmj = await UserModel.aggregate([ 
                    { 
                        $match: { _id: new ObjectId(userId), "requestsSent.receiverTeamId" : new ObjectId(teamId),
                            "requestsSent.requestStatus" : "PEND", "requestsSent.requestType" : parm.data._id
                        } 
                    }, 
                    { 
                        $project: {
                            requestsSent: {
                                $filter: {
                                    input: "$requestsSent",
                                    as: "req",
                                    cond: { $and : [
                                        { $eq: [ "$$req.receiverTeamId", new ObjectId(teamId) ] },
                                        { $eq: [ "$$req.requestStatus", "PEND" ] },
                                        { $eq: [ "$$req.requestType", new ObjectId(parm.data._id) ] },
                                    ]}
                                }
                            }
                        }
                    }
                ]).limit(1)
                if (aptmj === null || aptmj.length === 0) {
                    response.hasPending = false
                    let resp1 = getUsersTeams(userId)
                    let resp2 = getTeamDetails(teamId)
                    let [usersTeams, team] = await Promise.all([resp1, resp2])
                    if (team.requestStatus === "ACTC") {
                        let teamSport = team.details.sportsTypeId
                        let index = usersTeams.findIndex((i) => i.sportsTypeId.equals(teamSport))
                        if (index !== -1 ) {
                            response.playerCurrentTeam = usersTeams[index].teamName
                        } else {
                            response.playerCurrentTeam = ""
                        }
                        
                    }
                    response.requestStatus = "ACTC"
                    return response
                } else {
                    response.hasPending = true
                    response.requestStatus = "ACTC"
                    response.pendingJoinRequestId = aptmj[0].requestsSent[0]._id
                    return response
                }
            }
        }

        if (notifId === "APLGI") {      // approval request from league admin (league creator or team admin) to team to join league
            if (userId === "" || userId === null || teamId === "" || teamId === null || leagueId === "" || leagueId === null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let parm = await getNotifParmByNotifId(notifId)
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let resp1 = getNSLeaguesUserIsAdmin(userId)
                let resp2 = getTeamDetails(teamId)
                let resp3 = UserModel.aggregate([ 
                    { 
                        $match: { "requestsSent.receiverTeamId" : new ObjectId(teamId),
                            "requestsSent.requestStatus" : "PEND", "requestsSent.requestType" : parm.data._id
                        } 
                    }, 
                    { 
                        $project: {
                            requestsSent: {
                                $filter: {
                                    input: "$requestsSent",
                                    as: "req",
                                    cond: { $and : [
                                        { $eq: [ "$$req.receiverTeamId", new ObjectId(teamId) ] },
                                        { $eq: [ "$$req.requestStatus", "PEND" ] },
                                        { $eq: [ "$$req.requestType", parm.data._id ] },
                                    ]}
                                }
                            }
                        }
                    }
                ])
                let [usersLeagues, team, aplgi] = await Promise.all([resp1, resp2, resp3])
                if (team.requestStatus !== "ACTC") {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Team is invalid"
                    return response
                }
                let teamSport = team.details.sportsTypeId
                let nsLeaguesUserIsAdmin = await usersLeagues.filter(league => league.sportsTypeId.equals(teamSport))
                
                if (aplgi === null || aplgi.length === 0) {
                    response.hasPending = false
                    response.nsLeaguesUserIsAdmin = nsLeaguesUserIsAdmin
                    return response
                } else {
                    let found = false
                    let leagueIndex = 0
                    let promises = aplgi.requestsSent.map(async function(req) {
                        if (found === false) {
                        let notif = UserModel.aggregate([ 
                            { 
                                $match: { "notifications.forAction.requestId" : new ObjectId(req._id)
                                } 
                            }, 
                            { 
                                $project: {
                                    notifications: {
                                        $filter: {
                                            input: "$notifications",
                                            as: "notif",
                                            cond: {
                                                $eq: [ "$$notif.forAction.requestId", new ObjectId(req._id) ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]).limit(1)
                        if (notif !== null && notif.length > 0) {
                            leagueIndex = await nsLeaguesUserIsAdmin.findIndex((i) => i.leagueId.equals(notif[0].notifications[0].senderLeagueId))
                            if (leagueIndex !== -1) {
                                found = true
                                response.pendingInviteRequestId = req._id
                            }
                        }
                        }
                    })
                    await Promise.all(promises)
                    if (found === false) {
                        response.hasPending = false
                        response.requestStatus = "ACTC"
                        response.nsLeaguesUserIsAdmin = nsLeaguesUserIsAdmin
                    } else {
                        response.hasPending = true
                        response.requestStatus = "ACTC"
                    }
                    return response
                }
            }
        }

        if (notifId === "APLGJ") {      // approval request from team admin to league admin to join league
            if (userId === "" || userId === null || leagueId === "" || leagueId === null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let parm = await getNotifParmByNotifId(notifId)
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let aplgj = await UserModel.aggregate([ 
                    { 
                        $match: { _id: new ObjectId(userId), "requestsSent.receiverLeagueId" : new ObjectId(leagueId),
                            "requestsSent.requestStatus" : "PEND", "requestsSent.requestType" : parm.data._id
                        } 
                    }, 
                    { 
                        $project: {
                            requestsSent: {
                                $filter: {
                                    input: "$requestsSent",
                                    as: "req",
                                    cond: { $and : [
                                        { $eq: [ "$$req.receiverLeagueId", new ObjectId(leagueId) ] },
                                        { $eq: [ "$$req.requestStatus", "PEND" ] },
                                        { $eq: [ "$$req.requestType", parm.data._id ] },
                                    ]}
                                }
                            }
                        }
                    }
                ]).limit(1)
                if (aplgj === null || aplgj.length === 0) {
                    response.hasPending = false
                    let resp1 = getTeamsCreated(userId)
                    let resp2 = getLeagueDetails(leagueId)
                    let [teamsCreated, league] = await Promise.all([resp1, resp2])
                    if (league.requestStatus !== "ACTC") {
                        response.requestStatus = "RJCT"
                        response.errMsg = "League is invalid"
                        return response
                    }
                    let leagueSport = league.details.sportsTypeId
                    let teamsUserIsAdmin = await teamsCreated.filter(team => team.sportsTypeId.equals(leagueSport))
                    response.teamsCreated = teamsUserIsAdmin
                    response.requestStatus = "ACTC"
                    return response
                } else {
                    response.hasPending = true
                    response.pendingRequestId = aplgj[0].requestsSent[0]._id
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }

        if (notifId === "APLGR") {      // approval request from league admin to remove another team from the league
            if (userId === "" || userId === null || teamId === "" || teamId === null || leagueId === "" || leagueId === null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let parm = await getNotifParmByNotifId(notifId)
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let aplgr = await UserModel.aggregate([ 
                    { 
                        $match: { "requestsSent.receiverTeamId" : new ObjectId(teamId), "requestsSent.receiverLeagueId" : new ObjectId(leagueId),
                            "requestsSent.requestStatus" : "PEND", "requestsSent.requestType" : parm.data._id
                        } 
                    }, 
                    { 
                        $project: {
                            requestsSent: {
                                $filter: {
                                    input: "$requestsSent",
                                    as: "req",
                                    cond: { $and : [
                                        { $eq: [ "$$req.receiverTeamId", new ObjectId(teamId) ] },
                                        { $eq: [ "$$req.receiverLeagueId", new ObjectId(leagueId) ] },
                                        { $eq: [ "$$req.requestStatus", "PEND" ] },
                                        { $eq: [ "$$req.requestType", parm.data._id ] },
                                    ]}
                                }
                            }
                        }
                    }
                ]).limit(1)
                if (aplgr === null || aplgj.length === 0) {
                    response.hasPending = false
                    response.requestStatus = "ACTC"
                    return response
                } else {
                    response.hasPending = true
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }

        if (notifId === "APLGS") {      // approval to start league
            if (userId === "" || userId === null || leagueId === "" || leagueId === null) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let parm = await getNotifParmByNotifId(notifId)
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let aplgs = await UserModel.aggregate([ 
                    { 
                        $match: { "requestsSent.receiverLeagueId" : new ObjectId(leagueId),
                            "requestsSent.requestStatus" : "PEND", "requestsSent.requestType" : parm.data._id
                        } 
                    }, 
                    { 
                        $project: {
                            requestsSent: {
                                $filter: {
                                    input: "$requestsSent",
                                    as: "req",
                                    cond: { $and : [
                                        { $eq: [ "$$req.receiverLeagueId", new ObjectId(leagueId) ] },
                                        { $eq: [ "$$req.requestStatus", "PEND" ] },
                                        { $eq: [ "$$req.requestType", parm.data._id ] },
                                    ]}
                                }
                            }
                        }
                    }
                ]).limit(1)
                if (aplgs === null || aplgs.length === 0) {
                    response.hasPending = false
                    response.requestStatus = "ACTC"
                    return response
                } else {
                    response.hasPending = true
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }
    }
}