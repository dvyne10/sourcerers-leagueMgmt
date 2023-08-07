import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getUserFullname, getPlayerButtons } from "./usersModule.js";
import { getTeamDetails, getTeamsCreated, getUsersTeams, getTeamName } from "./teamsModule.js";
import { getLeagueMajorDetails, isLeagueAdmin, getLeagueButtons, getLeagueAdmins } from "./leaguesModule.js";
import { getNotifParmByNotifId, getSysParmByParmId, getSysParmList } from "./sysParmModule.js"
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
                if (notif.forAction.actionDone === "APRV") {
                    notifDetail.displayApproveButton = true
                } else if (notif.forAction.actionDone === "RJCT") {
                    notifDetail.displayRejectButton = true
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
            notifDetail.message = notifFormat.message
            if (notifDetail.message.indexOf("&senderUserName") !== -1 && notif.senderUserId && notif.senderUserId !== null) {
                let senderUserDetail = await getUserFullname(notif.senderUserId.toString(), "")
                notifDetail.message = formatNotifMsg(notifDetail.message, "&senderUserName", senderUserDetail.fullName)
            }
            if (notifDetail.message.indexOf("&senderTeamName") !== -1 && notif.senderTeamId && notif.senderTeamId !== null) {
                let senderTeamName = await getTeamName(notif.senderTeamId.toString())
                notifDetail.message = formatNotifMsg(notifDetail.message, "&senderTeamName", senderTeamName)
            }
            if (notifDetail.message.indexOf("&senderLeagueName") !== -1 && notif.senderLeagueId && notif.senderLeagueId !== null) {
                let senderLeagueDetail = await getLeagueMajorDetails(notif.senderLeagueId.toString())
                notifDetail.message = formatNotifMsg(notifDetail.message, "&senderLeagueName", senderLeagueDetail.leagueName)
            }
            if (notifDetail.message.indexOf("&matchTeamNames") !== -1 && notif.notificationDetails && notif.notificationDetails !== null) {
                let matchDetail = await getMatchDetails(notif.notificationDetails.trim())
                let teamName1 = matchDetail.details.team1.teamName
                let teamName2 = matchDetail.details.team2.teamName
                notifDetail.message = formatNotifMsg(notifDetail.message, "&matchTeamNames", `${teamName1} vs ${teamName2}`)
                let score = `${matchDetails.details.team1.finalScorePending}-${matchDetails.details.team2.finalScorePending}`
                notifDetail.message = formatNotifMsg(notifDetail.message, "&score", score)
                let points = `${matchDetails.details.team1.leaguePointsPending}-${matchDetails.details.team2.leaguePointsPending}`
                notifDetail.message = formatNotifMsg(notifDetail.message, "&points", points)
            }
            if (notifDetail.message.indexOf("&extraMsg") !== -1) {
                if (notif.notificationDetails && notif.notificationDetails !== null) {
                    notifDetail.message = formatNotifMsg(notifDetail.message, "&extraMsg", notif.notificationDetails)
                } else {
                    notifDetail.message = formatNotifMsg(notifDetail.message, "&extraMsg", " ")
                }
                
            }
        }
        return {...notifDetail }
    })

    notifs = await Promise.all(promise)
    response.requestStatus = "ACTC"
    response.details = notifs.sort((a,b) => b.creationDate - a.creationDate)
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
        $set: {"notifications.$[n1].readStatus": true, 
                "notifications.$[n1].forAction.actionDone": "APRV", "notifications.$[n1].forAction.actionTimestamp": getTimestamp(0) }
      }, {arrayFilters: [ { "n1._id": new ObjectId(notifId) }] })

    if (notifUpdate.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Notification not updated"
        return response
    }

    if (reqDetails.details.approvalsCounter + 1 < reqDetails.details.minimumApprovals) {
        await UserModel.updateOne({ "requestsSent._id" : notif.forAction.requestId }, { 
            $set: { $inc: {"requestsSent.$[n1].approvalsCounter": 1 } }
            }, {arrayFilters: [ { "n1._id": notif.forAction.requestId }] })
            response.requestStatus = "ACTC"
            return response
    }

    await UserModel.updateOne({ "requestsSent._id" : notif.forAction.requestId }, { 
        $set: { $inc: {"requestsSent.$[n1].approvalsCounter": 1 }, 
                "requestsSent.$[n1].requestStatus": "APRV", }
        }, {arrayFilters: [ { "n1._id": notif.forAction.requestId }] })

    let recordToUpdate, recordUpdated, newNotif
    if (requestType === "APMDU") {  // approval for match details update
        recordToUpdate = await LeagueModel.findOne({ "matches._id" : new ObjectId(notif.notificationDetails.trim()) }, { 
            "matches.$": 1, _id:0
        })
        recordUpdated = await LeagueModel.updateOne({ "matches._id" : new ObjectId(notif.notificationDetails.trim()) }, { 
            $set: { "matches.$[n1].team1.finalScore": recordToUpdate.team1.finalScorePending,
                    "matches.$[n1].team1.leaguePoints": recordToUpdate.team1.leaguePointsPending,
                    "matches.$[n1].team2.finalScore": recordToUpdate.team2.finalScorePending,
                    "matches.$[n1].team2.leaguePoints": recordToUpdate.team2.leaguePointsPending,
                    "matches.$[n1].team1.finalScorePending": null,
                    "matches.$[n1].team1.leaguePointsPending": null,
                    "matches.$[n1].team2.finalScorePending": null,
                    "matches.$[n1].team2.leaguePointsPending": null }
            }, {arrayFilters: [ { "n1._id": new ObjectId(notif.notificationDetails.trim()) }] })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Match update was not successful"
            return response
        }
        
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFMDA")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderLeagueId: notif.senderLeagueId,
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
            let [newNotif, admins] = await Promise.all([resp1, resp2])
            const promises = admins.map(async function(admin) {
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: newNotif.data._id,
                        senderLeagueId: notif.senderLeagueId,
                    } } 
                })
            })
            await Promise.all(promises);
            response.requestStatus = "ACTC"
            return response
        }
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
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
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
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationDetails: notif.forAction.requestId.toString()
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
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })

        // Send notifications to other league admins
        resp1 = getNotifParmByNotifId("NTFLGN")
        resp2 = getLeagueAdmins(notif.senderLeagueId.toString())
        let [newNotif, admins] = await Promise.all([resp1, resp2])
        const promises = admins.map(async function(admin) {
            if (!admin.userId.equals(notif.senderUserId)) {
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: newNotif.data._id,
                        senderTeamId: notif.senderTeamId,
                        senderLeagueId: notif.senderLeagueId,
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
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })

        // Send notifications to other league admins
        resp1 = getNotifParmByNotifId("NTFLGN")
        resp2 = getLeagueAdmins(notif.senderLeagueId.toString())
        let [newNotif, admins] = await Promise.all([resp1, resp2])
        const promises = admins.map(async function(admin) {
            if (!admin.userId.equals(new ObjectId(userId))) {
                await UserModel.updateOne({ _id : admin.userId }, { 
                    $push: { notifications : {
                        readStatus: false,
                        notificationType: newNotif.data._id,
                        senderTeamId: notif.senderTeamId,
                        senderLeagueId: notif.senderLeagueId,
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
        let [newNotif, admins] = await Promise.all([resp1, resp2])
        const promises = admins.map(async function(admin) {
            await UserModel.updateOne({ _id : admin.userId }, { 
                $push: { notifications : {
                    readStatus: false,
                    notificationType: newNotif.data._id,
                    senderLeagueId: notif.senderLeagueId,
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
        $set: {"notifications.$[n1].readStatus": true, "notifications.$[n1].forAction.actionDone": "RJCT", 
            "notifications.$[n1].forAction.actionTimestamp": getTimestamp(0) }
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
            }, {arrayFilters: [ { "n1._id": new ObjectId(notif.notificationDetails.trim()) }] })
        if (recordUpdated.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Match update was not successful"
            return response
        }
        
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFMDR")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderLeagueId: notif.senderLeagueId,
            } } 
        })
        response.requestStatus = "ACTC"
        return response  
    }
    
    if (requestType === "APTMI") {  // approval request from team admin to player to join team
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFTMIR")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response    
    }

    if (requestType === "APTMJ") {  // approval request from player to team admin to join team
        // Send notification to requestor player
        newNotif = await getNotifParmByNotifId("NTFTMJR")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response    
    }

    if (requestType === "APLGI") {  // approval request from league admin (league creator or team admin) to team to join league
        // Send notification to requestor league admin
        newNotif = await getNotifParmByNotifId("NTFLGIR")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response  
    }
    
    if (requestType === "APLGJ") {  // approval request from team admin to league admin (league creator or team admin) to join league
        // Send notification to requestor team admin
        newNotif = await getNotifParmByNotifId("NTFLGJR")
        await UserModel.updateOne({ _id : notif.senderUserId }, { 
            $push: { notifications : {
                readStatus: false,
                notificationType: newNotif.data._id,
                senderUserId: new ObjectId(userId),
                senderTeamId: notif.senderTeamId,
                senderLeagueId: notif.senderLeagueId,
                notificationDetails: notif.forAction.requestId.toString()
            } } 
        })
        response.requestStatus = "ACTC"
        return response  
    }
}

const getTimestamp = (daysToAdd) => {
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }