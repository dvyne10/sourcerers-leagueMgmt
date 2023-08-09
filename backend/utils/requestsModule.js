import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import { getPlayerButtons } from "./usersModule.js";
import { getTeamDetails, getTeamsCreated, getUsersTeams, isTeamMember, getTeamMajorDetails, getTeamButtons, 
    getTeamAdmin, removePlayerFromTeam } from "./teamsModule.js";
import { getLeagueDetails, isLeagueAdmin, getLeagueButtons, getLeagueAdmins, getNSLeaguesUserIsAdmin } from "./leaguesModule.js";
import { getNotifParmByNotifId, getSysParmByParmId, getSysParmList } from "./sysParmModule.js"

let ObjectId = mongoose.Types.ObjectId;

export const getRequestById = async function(requestId) {

    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (!mongoose.isValidObjectId(requestId.trim())) {
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
        response.details = await { ...req, requestId: new ObjectId(requestId), requestedBy : requestor }

        let notif = await UserModel.aggregate([ 
            { 
                $match: { "notifications.forAction.requestId" : new ObjectId(requestId)
                } 
            }, 
            { 
                $project: {
                    notifications: {
                        $filter: {
                            input: "$notifications",
                            as: "notif",
                            cond: {
                                $eq: [ "$$notif.forAction.requestId", new ObjectId(requestId) ]
                            }
                        }
                    }
                }
            }
        ]).limit(1)
        if (notif !== null && notif.length > 0) {
            notif = notif[0].notifications[0]
            response.details = await { ...response.details, senderTeamId: notif.senderTeamId, senderLeagueId : notif.senderLeagueId }
        }
        response.requestStatus = "ACTC"
        return response
    }
}

export const getRequestStatus = async function(requestId) {

    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (!mongoose.isValidObjectId(requestId.trim())) {
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
    }
    req = req[0].requestsSent[0]
    response.requestStatus = "ACTC"
    response.details = req
    return response
}

export const hasPendingRequest = async function(notifId, userId, playerId, teamId, leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (notifId.trim() === "" || !mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Entry parameters are required"
        return response
    } else {
        if (notifId === "APTMI") {      // approval request from team admin to player to join team
            if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(playerId.trim())) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let isPlayerAlreadyTeamMember = await isTeamMember(userId, playerId)
                if (isPlayerAlreadyTeamMember === true) {
                    response.hasPending = false
                    response.teamsCreated = []
                    response.requestStatus = "ACTC"
                    return response
                }
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
                    let req = await getRequestById(aptmi[0].requestsSent[0]._id.toString())
                    if (req.requestStatus === "ACTC" && req.details.senderTeamId) {
                        let teamReq = req.details.senderTeamId.toString()
                        let teamName = await getTeamName(teamReq)
                        response.teamNamePlayerIsInvitedTo = teamName
                        response.teamIdPlayerIsInvitedTo = req.details.senderTeamId
                    }
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }

        if (notifId === "APTMJ") {      // approval request from player to team admin to join team
            if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim())) {
                response.requestStatus = "RJCT"
                response.errMsg = "Entry parameters are required"
                return response
            } else {
                let resp1 = getTeamMajorDetails(teamId)
                let resp2 = getTeamsCreated(userId)  // cannot join another team of the same sport as what user created.
                let resp3 = getNotifParmByNotifId(notifId)
                let [team, teamsCreated, parm] = await Promise.all([resp1, resp2, resp3])
                if (parm.requestStatus !== 'ACTC') {
                    response.requestStatus = "RJCT"
                    response.errMsg = "Invalid notification type"
                    return response
                }
                let teamSport = team.sportsTypeId
                let index1 = teamsCreated.findIndex((i) => i.sportsTypeId.equals(teamSport))
                if (index1 !== -1) {
                    response.requestStatus = "ACTC"
                    response.canJoinTeam = false
                    response.playerCurrentTeamId = teamsCreated[index1].teamId
                    return response
                } 
                response.teamCreatedBy = team.createdBy
                let usersTeams = await getUsersTeams(userId)   // cannot join another team of the same sport where user is a member of. He will be pulled from the current team if continued.
                let index2 = usersTeams.findIndex((i) => i.sportsTypeId.equals(teamSport))
                if (index2 !== -1) {
                    response.canJoinTeam = true
                    response.playerCurrentTeamName = usersTeams[index2].teamName
                    response.playerCurrentTeamId = usersTeams[index2].teamId
                } else {
                    response.canJoinTeam = true
                    response.playerCurrentTeam = ""
                    response.playerCurrentTeamId = ""
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
            if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim())) {
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
                    response.requestStatus = "ACTC"
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
            if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
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
            if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
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
                    response.pendingRemovalRequestId = aplgr[0].requestsSent[0]._id
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }

        if (notifId === "APLGS") {      // approval to start league
            if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(userId.trim())) {
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
                    let league = await getLeagueDetails(leagueId)
                    if (league.requestStatus !== "ACTC") {
                        response.requestStatus = "RJCT"
                        response.errMsg = league.errMsg
                        return response
                    }
                    response.minApprovals = 999
                    if (league.details.teams.length > 0 && league.details.status === "NS") {
                        response.minApprovals = Math.ceil(league.details.teams.length/2)
                    }
                    response.requestStatus = "ACTC"
                    return response
                } else {
                    response.hasPending = true
                    response.pendingStartLeagueRequestId = aplgs[0].requestsSent[0]._id
                    response.requestStatus = "ACTC"
                    return response
                }
            }
        }
    }
}

export const joinLeague = async function(userId, teamId, leagueId, msg) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "APLGJ"

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let leagueButtons = await getLeagueButtons(userId, leagueId)
    if (leagueButtons.displayJoinButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot join the league."
        return response
    }
    if (leagueButtons.teamsCreated.findIndex(team => team.teamId.equals(teamId)) === -1) {
        response.requestStatus = "RJCT"
        response.errMsg = "You cannot do requests for the team."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type"
        return response
    }

    // Insert request record
    await UserModel.updateOne({ _id : new ObjectId(userId) }, { 
        $push: { requestsSent : {
          requestType: notif.data._id,
          requestStatus: "PEND",
          minimumApprovals: 1,
          approvalsCounter: 0,
          receiverLeagueId: new ObjectId(leagueId),
        } } 
    })

    // Send notifications to league admins
    let reqDetails = await hasPendingRequest(notifId, userId, "", "", leagueId)
    if (reqDetails !== null && reqDetails.requestStatus === "ACTC" && reqDetails.hasPending === true) {
        let pendingRequestId = reqDetails.pendingRequestId
        let admins = await getLeagueAdmins(leagueId)
        const promises = admins.map(async function(admin) {
            await UserModel.updateOne({ _id : admin.userId }, { 
                $push: { notifications : {
                    readStatus: false,
                    notificationType: notif.data._id,
                    senderUserId: new ObjectId(userId),
                    senderTeamId: new ObjectId(teamId),
                    senderLeagueId: new ObjectId(leagueId),
                    forAction: {
                        requestId: pendingRequestId,
                        actionDone: null,
                        actionTimestamp: null
                    },
                    notificationDetails: msg
                } } 
            })
        })
        await Promise.all(promises);
        response.requestStatus = "ACTC"
        return response
    }
    return response
}

export const unjoinLeague = async function(userId, leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "NTFLGL"

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let leagueButtons = await getLeagueButtons(userId, leagueId)
    if (leagueButtons.displayUnjoinButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot unjoin the league."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type."
        return response
    }

    // Remove from league
    let admins = await getLeagueAdmins(leagueId)
    let index = admins.findIndex(admin => admin.userId.equals(userId))
    if (index === -1 || !admins[index].teamId ) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid unjoin request."
        return response
    }
    
    let teamToUnjoin = admins[index].teamId
    let promise1 = LeagueModel.updateOne({ _id : new ObjectId(leagueId) }, { 
        $pull: { teams : {
          teamId: teamToUnjoin
        } } 
    })
    // TO DO - remove all notifs to or requests from user that is related to that leagueId !!!!!

    // Send notifications to league admins
    const promise2 = admins.map(async function(admin) {
        if (!admin.userId.equals(userId)) {
            await UserModel.updateOne({ _id : admin.userId }, { 
                $push: { notifications : {
                    readStatus: false,
                    notificationType: notif.data._id,
                    senderUserId: new ObjectId(userId),
                    senderTeamId: teamToUnjoin,
                    senderLeagueId: new ObjectId(leagueId),
                } } 
            })
        }
    })
    await Promise.all([promise1, promise2]);
    response.requestStatus = "ACTC"
    return response
}

export const startLeague = async function(userId, leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "APLGS"

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let leagueButtons = await getLeagueButtons(userId, leagueId)
    if (leagueButtons.displayStartLeagueButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot start the league."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type"
        return response
    }

    // Insert request record
    let exp = 15
    let startLeagueExp = await getSysParmByParmId("maxParms")
    if (startLeagueExp.requestStatus === "ACTC") {
        exp = startLeagueExp.data.maxParms.startLeagueApprovalExp
    }
    await UserModel.updateOne({ _id : new ObjectId(userId) }, { 
        $push: { requestsSent : {
          requestType: notif.data._id,
          requestStatus: "PEND",
          minimumApprovals: leagueButtons.minApprovals,
          approvalsCounter: 0,
          requestExpiry: getTimestamp(exp),
          receiverLeagueId: new ObjectId(leagueId),
        } } 
    })

    //Send notifications to league admins
    let reqDetails = await hasPendingRequest(notifId, userId, "", "", leagueId)
    if (reqDetails !== null && reqDetails.requestStatus === "ACTC" && reqDetails.hasPending === true) {
        let pendingRequestId = reqDetails.pendingStartLeagueRequestId
        let admins = await getLeagueAdmins(leagueId)
        const promises = admins.map(async function(admin) {
            if (!admin.userId.equals(new ObjectId(userId))) {       // send to all admins except requestor
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: notif.data._id,
                        senderUserId: new ObjectId(userId),
                        senderLeagueId: new ObjectId(leagueId),
                        forAction: {
                            requestId: pendingRequestId,
                            actionDone: null,
                            actionTimestamp: null
                        },
                    } } 
                })
            }
        })
        await Promise.all(promises);
        response.requestStatus = "ACTC"
        return response
    }
    return response
}

export const cancelRequest = async function(userId, requestId) {

    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User id required"
        return response
    }

    let req = await getRequestById(requestId)
    if (req.requestStatus !== "ACTC") {
        return req
    }

    if (req.details.requestStatus !== "PEND") {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot cancel a non-pending request."
        return response
    }

    let notifParms = await getSysParmList("notification_type")
    if (notifParms.requestStatus !== "ACTC" || notifParms.data.length === 0) {
        return notifParms
    }

    let cancellable = ["APTMI", "APTMJ", "APLGJ", "APLGI"]
    let cancellableNotifDetails = []
    await notifParms.data.map((notif) => {
        if (cancellable.findIndex(i => i === notif.notification_type.notifId) !== -1) {
            cancellableNotifDetails.push({parmId : notif._id, notifId: notif.notification_type.notifId, infoOrApproval: notif.notification_type.infoOrApproval.$and})
        }
    })

    let index = await cancellableNotifDetails.findIndex(i => i.parmId.equals(req.details.requestType))
    if (index === -1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot cancel the request."
        return response
    }

    // "APTMI", "APTMJ", "APLGJ" can only be cancelled by requestor
    if (cancellableNotifDetails[index].notifId !== "APLGI" && !req.details.requestedBy.equals(new ObjectId(userId))) {
        response.requestStatus = "RJCT"
        response.errMsg = "Not authorized to cancel the request."
        return response
    }

    // "APLGI" can be cancelled by any of the league admins
    if (cancellableNotifDetails[index].notifId === "APLGI" && !req.details.senderLeagueId) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid cancellation request."
        return response
    }

    if (cancellableNotifDetails[index].notifId === "APLGI") {
        let admin = await isLeagueAdmin(userId, req.details.senderLeagueId.toString())
        if (!admin) {
            response.requestStatus = "RJCT"
            response.errMsg = "Not authorized to cancel the request."
            return response
        }
    }

    let promise1 = UserModel.updateOne({ "requestsSent._id" : new ObjectId(requestId) }, { 
        $pull: { requestsSent : {
          _id: new ObjectId(requestId)
        } } 
    })

    let promise2 = UserModel.updateMany({ "notifications.forAction.requestId" : new ObjectId(requestId) }, { 
        $pull: { notifications : {
            "forAction.requestId": new ObjectId(requestId)
        } }
    })

    await Promise.all([promise1, promise2]);
    response.requestStatus = "ACTC"
    return response
}

export const inviteToTeam = async function(userId, teamId, playerId, msg) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "APTMI"
    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim()) || !mongoose.isValidObjectId(playerId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let playerButtons = await getPlayerButtons(userId, playerId)
    if (playerButtons.displayInviteToTeamButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot invite to team."
        return response
    }
    if (playerButtons.teamsCreated.findIndex(team => team.teamId.equals(teamId)) === -1) {
        response.requestStatus = "RJCT"
        response.errMsg = "You cannot do requests for the team."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type"
        return response
    }

    // Insert request record
    await UserModel.updateOne({ _id : new ObjectId(userId) }, { 
        $push: { requestsSent : {
          requestType: notif.data._id,
          requestStatus: "PEND",
          minimumApprovals: 1,
          approvalsCounter: 0,
          receiverUserId: new ObjectId(playerId),
        } } 
    })

    // Send notification to player
    let reqDetails = await hasPendingRequest(notifId, userId, playerId, "", "")
    if (reqDetails !== null && reqDetails.requestStatus === "ACTC" && reqDetails.hasPending === true) {
        let pendingRequestId = reqDetails.pendingInviteRequestId
        await UserModel.updateOne({ _id : new ObjectId(playerId) }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: notif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: new ObjectId(teamId),
                forAction: {
                    requestId: pendingRequestId,
                    actionDone: null,
                    actionTimestamp: null
                },
                notificationDetails: msg
            } } 
        })
        response.requestStatus = "ACTC"
        return response
    }
    return response
}

export const joinTeam = async function(userId, teamId, msg) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "APTMJ"

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let teamButtons = await getTeamButtons(userId, teamId)
    if (teamButtons.displayJoinButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot join the team."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type"
        return response
    }

    // Remove from current team of the same sport (if any)
    if (teamButtons.playerCurrentTeamId !== "") {
        let unjoinCurrent = await unjoinTeam(userId, teamButtons.playerCurrentTeamId.toString())
        if (unjoinCurrent.requestStatus !== "ACTC") {
            response.requestStatus = "RJCT"
            response.errMsg = "Cannot remove from current team."
            return response
        }
    }

    // Insert request record
    await UserModel.updateOne({ _id : new ObjectId(userId) }, { 
        $push: { requestsSent : {
          requestType: notif.data._id,
          requestStatus: "PEND",
          minimumApprovals: 1,
          approvalsCounter: 0,
          receiverTeamId: new ObjectId(teamId),
        } } 
    })

    // Send notifications to league admins
    let reqDetails = await hasPendingRequest(notifId, userId, "", teamId, "")
    if (reqDetails !== null && reqDetails.requestStatus === "ACTC" && reqDetails.hasPending === true) {
        let pendingJoinRequestId = reqDetails.pendingJoinRequestId
        let admin = reqDetails.teamCreatedBy
        await UserModel.updateOne({ _id : admin }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: notif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: new ObjectId(teamId),
                forAction: {
                    requestId: pendingJoinRequestId,
                    actionDone: null,
                    actionTimestamp: null
                },
                notificationDetails: msg
            } } 
        })
        response.requestStatus = "ACTC"
        return response
    }
    return response
}

export const unjoinTeam = async function(userId, teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "NTFPLL"

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let teamButtons = await getTeamButtons(userId, teamId)
    if (teamButtons.displayUnjoinButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot unjoin the team."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type."
        return response
    }

    // Remove from team
    let admin = await getTeamAdmin(teamId)
    let removalFromTeam = await removePlayerFromTeam(admin.toString(), teamId, userId)
    if (removalFromTeam.requestStatus !== "ACTC") {
        return removalFromTeam
    }

    // Send notification to team admin
    await UserModel.updateOne({ _id : admin }, { 
        $push: { notifications : {
            readStatus: false,
            notificationType: notif.data._id,
            senderUserId: new ObjectId(userId),
            senderTeamId: new ObjectId(teamId),
        } } 
    })
    response.requestStatus = "ACTC"
    return response
}

export const inviteToLeague = async function(userId, leagueId, teamId, msg) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "APLGI"
    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let teamButtons = await getTeamButtons(userId, teamId)
    if (teamButtons.displayInviteToLeagueButton !== true) {
        response.requestStatus = "RJCT"
        response.errMsg = "Cannot invite to league."
        return response
    }
    if (teamButtons.nsLeaguesUserIsAdmin.findIndex(league => league.leagueId.equals(leagueId)) === -1) {
        response.requestStatus = "RJCT"
        response.errMsg = "You cannot do requests for the league."
        return response
    }

    let notif = await getNotifParmByNotifId(notifId)
    if (notif.requestStatus !== 'ACTC') {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid notification type"
        return response
    }

    // Insert request record
    let teamAdmin = await getTeamAdmin(teamId)
    await UserModel.updateOne({ _id : new ObjectId(userId) }, { 
        $push: { requestsSent : {
          requestType: notif.data._id,
          requestStatus: "PEND",
          minimumApprovals: 1,
          approvalsCounter: 0,
          receiverUserId: teamAdmin,
          receiverTeamId: new ObjectId(teamId),
          receiverLeagueId: new ObjectId(leagueId),
        } } 
    })

    // Send notification to team admin
    let reqDetails = await hasPendingRequest(notifId, userId, "", teamId, "")
    if (reqDetails !== null && reqDetails.requestStatus === "ACTC" && reqDetails.hasPending === true) {
        let pendingRequestId = reqDetails.pendingInviteRequestId
        await UserModel.updateOne({ _id : teamAdmin }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: notif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: new ObjectId(teamId),
                senderLeagueId: new ObjectId(leagueId),
                forAction: {
                    requestId: pendingRequestId,
                    actionDone: null,
                    actionTimestamp: null
                },
                notificationDetails: msg
            } } 
        })
        response.requestStatus = "ACTC"
        return response
    }
    return response
}

const getTimestamp = (daysToAdd) => {
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }