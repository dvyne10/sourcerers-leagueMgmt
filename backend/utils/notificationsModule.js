import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getUserFullname, getPlayerButtons } from "./usersModule.js";
import { getTeamDetails, getTeamsCreated, getUsersTeams, isTeamMember } from "./teamsModule.js";
import { getLeagueMajorDetails, isLeagueAdmin, getLeagueButtons, getLeagueAdmins } from "./leaguesModule.js";
import { getNotifParmByNotifId, getSysParmByParmId, getSysParmList } from "./sysParmModule.js"

let ObjectId = mongoose.Types.ObjectId;

export const getUserNotifications = async function(userId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User id required"
        return response
    }

    let notifs = await UserModel.findOne({ _id : new ObjectId(userId) }, { _id: 0, notifications : 1 } )
    if (notifs === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "User is not found."
        return response
    }
    if (!notifs.notifications || !notifs.notifications.length === 0) {
        response.requestStatus = "ACTC"
        response.details = []
        return response
    }

    notifs = notifs.notifications
    notifParms = await getSysParmList("notification_type")
    if (notifParms.requestStatus !== "ACTC" || notifParms.data.length === 0) {
        response.requestStatus = "ACTC"
        response.details = []
        return response
    }

    let index, notifFormat, reqDetails, notifDetail
    promise = notifs.map(async(notif) => {
        notifDetail = {notifId: notif._id, readStatus: notif.readStatus, notificationType: notif.notificationType, creationDate: notif.createdAt,
            enableApproveButton: false, displayApproveButton: false, enableRejectButton: false, displayRejectButton: false}
        index = notifParms.data.findIndex(parm => parm._id.equals(notif.notificationType))
        if (index !== -1) {
            notifFormat = notifParms.data[index].notification_type
            if (notifFormat.infoOrApproval !== "INFO") {
                if (notif.forAction.actionDone === "APRV") {
                    notifDetail.displayApproveButton = true
                } else if (notif.forAction.actionDone === "RJCT") {
                    notifDetail.displayRejectButton = true
                } else {
                    reqDetails = await getRequestStatus(notif.forAction.requestId.toString())
                    if (reqDetails.requestStatus === "ACTC") {
                        if (reqDetails.details.requestStatus === "PEND") {
                            if (notifFormat.infoOrApproval === "APRV") {
                                notifDetail.enableApproveButton = true
                            } else if (notifFormat.infoOrApproval === "APRVREJ") {
                                notifDetail.enableApproveButton = true
                                notifDetail.enableRejectButton = true
                            }
                        } else {
                            if (notifFormat.infoOrApproval === "APRV") {
                                notifDetail.displayApproveButton = true
                            } else if (notifFormat.infoOrApproval === "APRVREJ") {
                                notifDetail.displayApproveButton = true
                                notifDetail.displayRejectButton = true
                            }
                        }
                        
                    }
                } 
            }
            notifDetail.message = notifFormat.message
            if (notifDetail.message.indexOf("&senderUserName") !== -1 && notif.senderUserId && notif.senderUserId !== null) {
                senderUserDetail = await getUserFullname(notif.senderUserId.toString(), "")
                formatNotifMsg(notifDetail.message, "&senderUserName", senderUserDetail.fullName)
            }
            if (notifDetail.message.indexOf("&senderTeamName") !== -1 && notif.senderTeamId && notif.senderTeamId !== null) {
                senderTeamName = await getTeamName(notif.senderTeamId.toString())
                formatNotifMsg(notifDetail.message, "&senderTeamName", senderTeamName)
            }
            if (notifDetail.message.indexOf("&senderLeagueName") !== -1 && notif.senderLeagueId && notif.senderLeagueId !== null) {
                senderLeagueDetail = await getLeagueMajorDetails(notif.senderLeagueId.toString())
                formatNotifMsg(notifDetail.message, "&senderLeagueName", senderLeagueDetail.leagueName)
            }
            if (notifDetail.message.indexOf("&extraMsg") !== -1 && notif.notificationDetails && notif.notificationDetails !== null) {
                formatNotifMsg(notifDetail.message, "&extraMsg", notif.notificationDetails)
            }
        }
        return notifDetail
    })
    response.requestStatus = "ACTC"
    response.details = notifs
    return response
}

const formatNotifMsg = function(message, fromKeyword, toName) {
    if (message === "" || fromKeyword === "" || toName === "") {
        return message
    }
    let startString = ""
    let endString = ""
    let startPos = message.indexOf(fromKeyword)
    if (startPos === -1) {
        return message
    }
    let endPos = message.indexOf(" ", startPos)
    if (startPos > 0) {
        startString = message.substring(0,startPos)
    }
    if (endPos > 0 && endPos !== -1) {
        endString = message.substring(endPos)
    }
    return startString + toName + endString
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