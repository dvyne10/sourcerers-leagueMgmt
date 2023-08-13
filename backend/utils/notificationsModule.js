import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import { getUserFullname } from "./usersModule.js";
import { getTeamName } from "./teamsModule.js";
import { getLeagueMajorDetails, getLeagueAdmins } from "./leaguesModule.js";
import { getNotifParmByNotifId, getSysParmById, getSysParmList } from "./sysParmModule.js"
import { getRequestStatus } from "./requestsModule.js"
import { getMatchDetails } from "./matchModule.js"

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
    let notifParms = await getSysParmList("notification_type")
    if (notifParms.requestStatus !== "ACTC" || notifParms.data.length === 0) {
        response.requestStatus = "ACTC"
        response.details = []
        return response
    }

    let promise = notifs.map(async(notif) => {
        let notifDetail = {notifId: notif._id, readStatus: notif.readStatus, notificationType: notif.notificationType, creationDate: notif.createdAt,
            enableApproveButton: false, displayApproveButton: false, enableRejectButton: false, displayRejectButton: false}
        let index = notifParms.data.findIndex(parm => parm._id.equals(notif.notificationType))
        if (index !== -1) {
            let notifFormat = notifParms.data[index].notification_type
            if (notifFormat.infoOrApproval !== "INFO") {
                if (notif.forAction.actionDone === "APRV" || notif.forAction.actionDone === "RJCT") {
                    if (notifFormat.infoOrApproval === "APRV") {
                        notifDetail.displayApproveButton = true
                    } else if (notifFormat.infoOrApproval === "APRVREJ") {
                        notifDetail.displayApproveButton = true
                        notifDetail.displayRejectButton = true
                    }
                } else {
                    let reqDetails = await getRequestStatus(notif.forAction.requestId.toString())
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
            notifDetail.message = notif.notificationMsg
        }
        return {...notifDetail }
    })

    notifs = await Promise.all(promise)
    response.requestStatus = "ACTC"
    response.details = notifs.sort((a,b) => b.creationDate - a.creationDate)
    return response
}

export const genNotifMsg = async function(notifId, senderUserId, senderTeamId, senderLeagueId, matchDetails, extraMsg) {
    let notifParm = await getNotifParmByNotifId(notifId)
    if (notifParm.requestStatus !== "ACTC") {
        return ""
    }
    let notifMsg = notifParm.data.notification_type.message
    let promise1 = getUserFullname(senderUserId, "")
    let promise2 = getTeamName(senderTeamId)
    let promise3 = getLeagueMajorDetails(senderLeagueId)
    let [senderUserDetail, senderTeamName, senderLeagueDetail] = await Promise.all([promise1, promise2, promise3])

    if (notifMsg.indexOf("&senderUserName") !== -1) {
        notifMsg = formatNotifMsg(notifMsg, "&senderUserName", senderUserDetail.fullName)
    }
    if (notifMsg.indexOf("&senderTeamName") !== -1) {
        notifMsg = formatNotifMsg(notifMsg, "&senderTeamName", senderTeamName)
    }
    if (notifMsg.indexOf("&senderLeagueName") !== -1) {
        notifMsg = formatNotifMsg(notifMsg, "&senderLeagueName", senderLeagueDetail.leagueName)
    }
    if (notifMsg.indexOf("&matchDetails") !== -1) {
        notifMsg = formatNotifMsg(notifMsg, "&matchDetails", matchDetails)
    }
    if (notifMsg.indexOf("&extraMsg") !== -1) {
        if (extraMsg !== null && extraMsg !== "") {
            notifMsg = formatNotifMsg(notifMsg, "&extraMsg", extraMsg)
        } else {
            notifMsg = formatNotifMsg(notifMsg, "&extraMsg", " ")
        }  
    }
    return notifMsg
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

export const getUnreadNotifsCount = async function(userId) {

    if (!mongoose.isValidObjectId(userId.trim())) {
        return 0
    }

    let unreadNotifs = await UserModel.aggregate([
        {
            $match: {_id : new ObjectId(userId) }
        },
        { 
            $addFields: {
                count: {
                    $reduce: {
                        input: "$notifications",
                        initialValue: 0,
                        in: {
                            $add: [ "$$value", {$cond: [{ $eq : [ "$$this.readStatus", false ] },  1 , 0]}]
                        }
                    }
                }
            }, 
        }, { 
            $project: {
                _id: 0, count: 1
                
            }
        }
    ])
    if (unreadNotifs === null || unreadNotifs[0].count === null) {
        return 0
    } else {
        return unreadNotifs[0].count
    }
}

export const readUnreadNotif = async function(userId, notifId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(notifId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let notif = await UserModel.findOne({ _id : new ObjectId(userId), "notifications._id" : new ObjectId(notifId) }, { 
        "notifications.$": 1, _id: 0
    })

    if (!notif) {
        response.requestStatus = "RJCT"
        response.errMsg = "No notification found"
        return response
    }

    let notifUpdate = await UserModel.updateOne({ _id : new ObjectId(userId), "notifications._id" : new ObjectId(notifId) }, { 
        $set: {"notifications.$[n1].readStatus": !notif.notifications[0].readStatus }
      }, {arrayFilters: [ { "n1._id": new ObjectId(notifId) }] })

    if (notifUpdate.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Notification not updated"
        return response
    } else {
        response.requestStatus = "ACTC"
        return response
    }
}

export const approveRequest = async function(userId, notifId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(notifId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let notif = await UserModel.findOne({ _id : new ObjectId(userId), "notifications._id" : new ObjectId(notifId) }, { 
        "notifications.$": 1, _id: 0
    })

    if (!notif) {
        response.requestStatus = "RJCT"
        response.errMsg = "No notification found"
        return response
    }

    notif = notif.notifications[0]
    if (!notif.forAction || notif.forAction.actionDone !== null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No action allowed"
        return response
    }

    let resp1 = getRequestStatus(notif.forAction.requestId.toString())
    let resp2 = getSysParmById(notif.notificationType.toString())
    let [reqDetails, notifParm] = await Promise.all([resp1, resp2])
    if (reqDetails.requestStatus !== "ACTC" || reqDetails.details.requestStatus  !== "PEND" || notifParm.notification_type.infoOrApproval === "INFO") {
        response.requestStatus = "RJCT"
        response.errMsg = "No action allowed"
        return response
    }

    let requestType = notifParm.notification_type.notifId
    if (requestType === "APMDU" && !mongoose.isValidObjectId(notif.notificationDetails.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid match detail"
        return response
    }

    let notifUpdate = await UserModel.updateOne({ _id : new ObjectId(userId), "notifications._id" : new ObjectId(notifId) }, { 
        $set: {"notifications.$[n1].forAction.actionDone": "APRV", "notifications.$[n1].forAction.actionTimestamp": getTimestamp(0) }      
      }, {arrayFilters: [ { "n1._id": new ObjectId(notifId) }] })

    if (notifUpdate.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Notification not updated"
        return response
    }

    let approvalCountNew = reqDetails.details.approvalsCounter + 1
    if (reqDetails.details.approvalsCounter + 1 < reqDetails.details.minimumApprovals) {
        await UserModel.updateOne({ "requestsSent._id" : notif.forAction.requestId }, { 
            $set: { "requestsSent.$[n1].approvalsCounter": approvalCountNew }
            }, {arrayFilters: [ { "n1._id": notif.forAction.requestId }] })
            response.requestStatus = "ACTC"
            return response
    }

    await UserModel.updateOne({ "requestsSent._id" : notif.forAction.requestId }, { 
        $set: { "requestsSent.$[n1].approvalsCounter": approvalCountNew, 
                "requestsSent.$[n1].requestStatus": "APRV", }
        }, {arrayFilters: [ { "n1._id": notif.forAction.requestId }] })

    let recordToUpdate, recordUpdated, newNotif
    if (requestType === "APMDU") {  // approval for match details update
        let matchId = notif.notificationDetails.trim()
        recordToUpdate = await LeagueModel.findOne({ "matches._id" : new ObjectId(matchId) }, { 
            "matches.$": 1, _id:0
        })
        recordUpdated = await LeagueModel.updateOne({ "matches._id" : new ObjectId(matchId) }, { 
            $set: { "matches.$[n1].team1.finalScore": recordToUpdate.matches[0].team1.finalScorePending,
                    "matches.$[n1].team1.leaguePoints": recordToUpdate.matches[0].team1.leaguePointsPending,
                    "matches.$[n1].team2.finalScore": recordToUpdate.matches[0].team2.finalScorePending,
                    "matches.$[n1].team2.leaguePoints": recordToUpdate.matches[0].team2.leaguePointsPending,
                    "matches.$[n1].team1.finalScorePending": null,
                    "matches.$[n1].team1.leaguePointsPending": null,
                    "matches.$[n1].team2.finalScorePending": null,
                    "matches.$[n1].team2.leaguePointsPending": null }
            }, {arrayFilters: [ { "n1._id": new ObjectId(matchId) }] })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Match update was not successful"
            return response
        }
        
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFMDA")
        let notifMsg = await genNotifMsg("NTFMDA", userId, "", notif.senderLeagueId.toString(), "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderLeagueId: notif.senderLeagueId,
                notificationMsg: notifMsg,
            } } 
        })

        recordToUpdate = await LeagueModel.findOne({ _id : notif.senderLeagueId }, { 
            "matches.team1.players" : 0, "matches.team2.players" : 0, teams: 0
        })
        let found = recordToUpdate.matches.findIndex(match => 
                match.team1.finalScore === null || match.team1.leaguePoints === null ||
                match.team2.finalScore === null || match.team2.leaguePoints === null ||
                match.team1.finalScorePending !== null || match.team1.leaguePointsPending !== null ||
                match.team2.finalScorePending !== null || match.team2.leaguePointsPending !== null
                )
        if (found === -1) {
            //if all matches have been updated and approved, change league status to "EN"
            recordUpdated = await LeagueModel.updateOne({ _id : notif.senderLeagueId }, { $set: { status : "EN" } })
            
            // Send notification to league admins
            resp1 = getNotifParmByNotifId("NTFLGE")
            resp2 = getLeagueAdmins(notif.senderLeagueId.toString())
            let resp3 = genNotifMsg("NTFLGE", "", "", notif.senderLeagueId.toString(), "", "")
            let [newNotif, admins, notifMsg] = await Promise.all([resp1, resp2, resp3])
            const promises = admins.map(async function(admin) {
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: newNotif.data._id,
                        senderLeagueId: notif.senderLeagueId,
                        notificationMsg: notifMsg,
                    } } 
                })
            })
            await Promise.all(promises);
        }
        response.requestStatus = "ACTC"
        return response
    }

    if (requestType === "APTMI") {  // approval request from team admin to player to join team
        recordUpdated = await UserModel.updateOne({ _id : notif.senderUserId, "teamsCreated._id" : notif.senderTeamId }, { 
            $push: { "teamsCreated.$.players" : {
              playerId: new ObjectId(userId),
              joinedTimestamp: getTimestamp(0),
            } } 
          })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Approval of invitation to team was not successful"
            return response
        }
        
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFTMIA")
        let notifMsg = await genNotifMsg("NTFTMIA", userId, notif.senderTeamId.toString(), "", "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response    
    }

    if (requestType === "APTMJ") {  // approval request from player to team admin to join team
        recordUpdated = await UserModel.updateOne({ _id : new ObjectId(userId), "teamsCreated._id" : notif.senderTeamId }, { 
            $push: { "teamsCreated.$.players" : {
              playerId: notif.senderUserId,
              joinedTimestamp: getTimestamp(0),
            } } 
          })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Approval of request to join team was not successful"
            return response
        }
        
        // Send notification to requestor player
        newNotif = await getNotifParmByNotifId("NTFTMJA")
        let notifMsg = await genNotifMsg("NTFTMJA", userId, notif.senderTeamId.toString(), "", "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString(),
            } } 
        })
        response.requestStatus = "ACTC"
        return response    
    }

    if (requestType === "APLGI") {  // approval request from league admin (league creator or team admin) to team to join league
        recordUpdated = await LeagueModel.updateOne({ _id : notif.senderLeagueId }, { 
            $push: { "teams" : {
                teamId: notif.senderTeamId,
                approvedBy: notif.senderUserId,
                joinedTimestamp: getTimestamp(0),
            } } 
          })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Approval of invitation to join league was not successful"
            return response
        }
        
        // Send notification to requestor league admin
        newNotif = await getNotifParmByNotifId("NTFLGIA")
        let notifMsg = await genNotifMsg("NTFLGIA", userId, notif.senderTeamId.toString(), notif.senderLeagueId.toString(), "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })

        // Send notifications to other league admins
        resp1 = getNotifParmByNotifId("NTFLGN")
        resp2 = getLeagueAdmins(notif.senderLeagueId.toString())
        let resp3 = genNotifMsg("NTFLGN", "", notif.senderTeamId.toString(), notif.senderLeagueId.toString(), "", "")
        let [newNotif, admins, notifMsg2] = await Promise.all([resp1, resp2, resp3])
        const promises = admins.map(async function(admin) {
            if (!admin.userId.equals(notif.senderUserId)) {
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: newNotif.data._id,
                        senderTeamId: notif.senderTeamId,
                        senderLeagueId: notif.senderLeagueId,
                        notificationMsg: notifMsg2,
                        notificationDetails: notif.forAction.requestId.toString()
                    } } 
                })
            }
        })
        await Promise.all(promises);
        response.requestStatus = "ACTC"
        return response  
    }
    
    if (requestType === "APLGJ") {  // approval request from team admin to league admin (league creator or team admin) to join league
        recordUpdated = await LeagueModel.updateOne({ _id : notif.senderLeagueId }, { 
            $push: { "teams" : {
                teamId: notif.senderTeamId,
                approvedBy: new ObjectId(userId),
                joinedTimestamp: getTimestamp(0),
            } } 
          })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Approval of request to join league was not successful"
            return response
        }
        
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFLGJA")
        let notifMsg = await genNotifMsg("NTFLGJA", userId, senderTeamId.toString(), notif.senderLeagueId.toString(), "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })

        // Send notifications to other league admins
        resp1 = getNotifParmByNotifId("NTFLGN")
        resp2 = getLeagueAdmins(notif.senderLeagueId.toString())
        let resp3 = genNotifMsg("NTFLGN", "", senderTeamId.toString(), notif.senderLeagueId.toString(), "", "")
        let [newNotif, admins, notifMsg2] = await Promise.all([resp1, resp2, resp3])
        const promises = admins.map(async function(admin) {
            if (!admin.userId.equals(new ObjectId(userId))) {
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: newNotif.data._id,
                        senderTeamId: notif.senderTeamId,
                        senderLeagueId: notif.senderLeagueId,
                        notificationMsg: notifMsg2,
                        notificationDetails: notif.forAction.requestId.toString()
                    } } 
                })
            }
        })
        await Promise.all(promises);
        response.requestStatus = "ACTC"
        return response  
    }
    
    if (requestType === "APLGS") {  // approval to start league
        recordToUpdate = await LeagueModel.findOne({ _id : notif.senderLeagueId }, { 
            teams: 1, _id:0
        })
        //Generate match rosters
        let genMatches = []
        for (let r = 0; r < recordToUpdate.numberOfRounds; r++) {
            for (let i = 0; i < recordToUpdate.teams.length; i++) {
                for (let j = (i + 1); j < recordToUpdate.teams.length; j++) {
                    genMatches.push({dateOfMatch: null, locationOfMatch: null, 
                        team1: { teamId: recordToUpdate.teams[i].teamId, finalScore: null, finalScorePending: null, 
                            leaguePoints: null, leaguePointsPending: null, players: [] 
                        },
                        team2: { teamId: recordToUpdate.teams[j].teamId, finalScore: null, finalScorePending: null, 
                            leaguePoints: null, leaguePointsPending: null, players: [] 
                        },
                    })
                }
            }
        }
        // Update status to ST
        recordUpdated = await LeagueModel.updateOne({ _id : notif.senderLeagueId }, { 
            $set: { status: "ST", lookingForTeams: false, lookingForTeamsChgTmst: getTimestamp(0), matches: genMatches } })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Start league was not successful"
            return response
        }
        
        // Send notification to league admins
        resp1 = getNotifParmByNotifId("NTFLGS")
        resp2 = getLeagueAdmins(notif.senderLeagueId.toString())
        let resp3 = genNotifMsg("NTFLGS", "", "", notif.senderLeagueId.toString(), "", "")
        let [newNotif, admins, notifMsg] = await Promise.all([resp1, resp2, resp3])
        const promises = admins.map(async function(admin) {
            await UserModel.updateOne({ _id : admin.userId }, { 
                $push: { notifications : {
                    readStatus: false,
                    notificationType: newNotif.data._id,
                    senderLeagueId: notif.senderLeagueId,
                    notificationMsg: notifMsg,
                    notificationDetails: notif.forAction.requestId.toString()
                } } 
            })
        })
        await Promise.all(promises);

        // Update any pending request/invite to join league to EXP
        resp1 = getNotifParmByNotifId("APLGJ")
        resp2 = getNotifParmByNotifId("APLGI")
        let [newNotif1, newNotif2] = await Promise.all([resp1, resp2])
        await UserModel.updateMany(
            { $or : [ {"requestsSent.requestType" : newNotif1.data._id, "requestsSent.receiverLeagueId" : notif.senderLeagueId, "requestsSent.requestStatus" : "PEND"},
                {"requestsSent.requestType" : newNotif2.data._id, "requestsSent.receiverLeagueId" : notif.senderLeagueId, "requestsSent.requestStatus" : "PEND"}]
            }, { $set: { "requestsSent.$[n1].requestStatus": "EXP"} 
            }, {arrayFilters: [ { $or : [ {"n1.receiverLeagueId": notif.senderLeagueId, "n1.requestType" : newNotif1.data._id }, 
                                        {"n1.receiverLeagueId": notif.senderLeagueId, "n1.requestType" : newNotif2.data._id }
            ] }] })

        response.requestStatus = "ACTC"
        return response
    }
    
}

export const rejectRequest = async function(userId, notifId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(notifId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }

    let notif = await UserModel.findOne({ _id : new ObjectId(userId), "notifications._id" : new ObjectId(notifId) }, { 
        "notifications.$": 1, _id: 0
    })

    if (!notif) {
        response.requestStatus = "RJCT"
        response.errMsg = "No notification found"
        return response
    }

    notif = notif.notifications[0]
    if (!notif.forAction || notif.forAction.actionDone !== null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No action allowed"
        return response
    }

    let resp1 = getRequestStatus(notif.forAction.requestId.toString())
    let resp2 = getSysParmById(notif.notificationType.toString())
    let [reqDetails, notifParm] = await Promise.all([resp1, resp2])
    if (reqDetails.requestStatus !== "ACTC" || reqDetails.details.requestStatus  !== "PEND" || notifParm.notification_type.infoOrApproval !== "APRVREJ") {
        response.requestStatus = "RJCT"
        response.errMsg = "No action allowed"
        return response
    }

    let requestType = notifParm.notification_type.notifId
    if (requestType === "APMDU" && !mongoose.isValidObjectId(notif.notificationDetails.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid match detail"
        return response
    }

    let notifUpdate = await UserModel.updateOne({ _id : new ObjectId(userId), "notifications._id" : new ObjectId(notifId) }, { 
        $set: {"notifications.$[n1].forAction.actionDone": "RJCT", "notifications.$[n1].forAction.actionTimestamp": getTimestamp(0) }
        }, {arrayFilters: [ { "n1._id": new ObjectId(notifId) }] })

    if (notifUpdate.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Notification not updated"
        return response
    }

    await UserModel.updateOne({ "requestsSent._id" : notif.forAction.requestId }, { 
        $set: { "requestsSent.$[n1].requestStatus": "RJCT" }
        }, {arrayFilters: [ { "n1._id": notif.forAction.requestId }] })

    let recordToUpdate, recordUpdated, newNotif
    if (requestType === "APMDU") {  // approval for match details update
        recordUpdated = await LeagueModel.updateOne({ "matches._id" : new ObjectId(notif.notificationDetails.trim()) }, { 
            $set: { "matches.$[n1].team1.finalScorePending": null,
                    "matches.$[n1].team1.leaguePointsPending": null,
                    "matches.$[n1].team2.finalScorePending": null,
                    "matches.$[n1].team2.leaguePointsPending": null }
            }, {arrayFilters: [ { "n1._id": new ObjectId(notif.notificationDetails.substring(0,30).trim()) }] })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Match update was not successful"
            return response
        }
        
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFMDR")
        let notifMsg = await genNotifMsg("NTFMDR", userId, "", notif.senderLeagueId.toString(), "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderLeagueId: notif.senderLeagueId,
                notificationMsg: notifMsg,
            } } 
        })
        response.requestStatus = "ACTC"
        return response  
    }
    
    if (requestType === "APTMI") {  // approval request from team admin to player to join team
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFTMIR")
        let notifMsg = await genNotifMsg("NTFTMIR", userId, notif.senderTeamId.toString(), "", "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response    
    }

    if (requestType === "APTMJ") {  // approval request from player to team admin to join team
        // Send notification to requestor player
        newNotif = await getNotifParmByNotifId("NTFTMJR")
        let notifMsg = await genNotifMsg("NTFTMJR", userId, notif.senderTeamId.toString(), "", "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response    
    }

    if (requestType === "APLGI") {  // approval request from league admin (league creator or team admin) to team to join league
        // Send notification to requestor league admin
        newNotif = await getNotifParmByNotifId("NTFLGIR")
        let notifMsg = await genNotifMsg("NTFLGIR", userId, notif.senderTeamId.toString(), notif.senderLeagueId.toString(), "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response  
    }
    
    if (requestType === "APLGJ") {  // approval request from team admin to league admin (league creator or team admin) to join league
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFLGJR")
        let notifMsg = await genNotifMsg("NTFLGJR", userId, notif.senderTeamId.toString(), notif.senderLeagueId.toString(), "", "")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationMsg: notifMsg,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response  
    }
}

export const processContactUsMsgs = async function(msgBody) {

    let fullName = msgBody.fullName
    let email = msgBody.email
    let msg = msgBody.msg
    let notifMsg = `Full Name: ${fullName}, email: ${email}, msg: ${msg}`
    let newNotif = await getNotifParmByNotifId("NTFCTCT")
    await UserModel.updateMany({ userType : "ADMIN" }, { 
        $push: { notifications : {
            readStatus: false,
            notificationType: newNotif.data._id,
            notificationMsg: notifMsg,
        } } 
    })
    return ""

}

const getTimestamp = (daysToAdd) => {
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }