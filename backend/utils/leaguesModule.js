import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getManyTeamNames, getTeamsCreated, getTeamAdmin } from "./teamsModule.js";
import { getSportsList, getSportName, getNotifParmByNotifId } from "./sysParmModule.js";
import { hasPendingRequest } from "./requestsModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const getLeagues = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    
    let leagues = await LeagueModel.aggregate([
        { 
            $addFields: {
                totalPoints: {
                    $reduce: {
                        input: "$matches",
                        initialValue: 0,
                        in: {
                            $add: [ "$$value", "$$this.team1.leaguePoints", "$$this.team2.leaguePoints"]
                        }
                    }
                }, leagueId: "$_id", 
                matches: {
                    $map: {
                        input: "$matches",
                        as: "item",
                        in: {
                            matchId: "$$item._id",
                            dateOfMatch: "$$item.dateOfMatch",
                            locationOfMatch: "$$item.locationOfMatch",
                            team1: "$$item.team1",
                            team2: "$$item.team2",
                        }
                    }
                }
            }, 
        }, {
            $sort: { status : -1}
        }, { 
            $project: {
                totalPoints: 0, _id: 0, "matches.team1.players" : 0, "matches.team2.players" : 0,
                
            }
        }
    ])
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (leagues.length === 0) {
        response.requestStatus = "ACTC"
        response.errMsg = "No data found"
        response.details = []
        return response
    }

    let sports = []
    let sportsParms = await getSportsList()
    if (sportsParms.requestStatus === 'ACTC') {
        sports = sportsParms.data
    }

    let teams
    let fullName
    let sportsName
    let sportIndex = 0
    const promises = leagues.map(async function(league) {
        teams = getManyTeamNames(league.teams)
        fullName = UserModel.findOne({ _id: new ObjectId(league.createdBy)}, { _id :0, firstName : 1, lastName :  1 })
                .then((creator) => {
                    if (creator !== null) {
                        return `${creator.firstName} ${creator.lastName}`
                    } else {
                        return ""
                    }
                });
        sportIndex = sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
        sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
        const [teamNames, leagueCreator, leagueSportName] = await Promise.all([teams, fullName, sportsName])
        return { ...league, teams : teamNames, createdByName: leagueCreator, sportsName: leagueSportName };
    })
    
    const leaguesWithdetails = await Promise.all(promises);
    response.requestStatus = "ACTC"
    response.details = leaguesWithdetails
    return response
}

export const getLeagueDetailsAndButtons = async function(userId, leagueId) {
    let league
    let leagueButtons
    if (userId !== null && userId.trim() !== "") {
        league = getLeagueDetails(leagueId)
        leagueButtons = getLeagueButtons(userId, leagueId)
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

export const getLeagueDetails = async function(leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (leagueId === null || leagueId.trim() === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "League Id is required."
        return response
    }
    
    let leagues = await LeagueModel.aggregate([ { $match : { _id : new ObjectId(leagueId) } },
        { 
            $addFields: {
                leagueId: "$_id", 
                matches: {
                    $map: {
                        input: "$matches",
                        as: "item",
                        in: {
                            matchId: "$$item._id",
                            dateOfMatch: "$$item.dateOfMatch",
                            locationOfMatch: "$$item.locationOfMatch",
                            team1: "$$item.team1",
                            team2: "$$item.team2",
                        }
                    }
                }
            }, 
        }, { 
            $project: {
                _id: 0, "matches.team1.players" : 0, "matches.team2.players" : 0,
                
            }
        }
    ]).limit(1)
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (leagues.length === 0) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    let league = leagues[0]
    let teams = getManyTeamNames(league.teams)
    let sportsName = getSportName(league.sportsTypeId.toString())

    const [teamNames, leagueSportName] = await Promise.all([teams, sportsName])
    const leagueWithdetails = { ...league, teams : teamNames, sportsName: leagueSportName };

    response.requestStatus = "ACTC"
    response.details = leagueWithdetails
    return response
}

export const getLeagueButtons = async function(userId, leagueId) {
    let response = { displayUpdateButton : false, displayTurnOnLookingForTeams: false, displayTurnOffLookingForTeams : false, 
        displayUnjoinButton: false, displayJoinButton: false, teamsCreated: [],  displayCancelReqButton: false, pendingRequestId : "", 
        displayStartLeagueButton: false, displayPendingStartLeagueInd: false }

    if (userId === null || userId.trim() === "" || leagueId === null || leagueId.trim() === "") {
        return response
    }
    
    let league = await LeagueModel.findOne({ _id : leagueId }, { matches : 0 })
    if (league === null) {
        return response
    }

    let admin = await isLeagueAdmin(userId, leagueId)
    if (admin === true) {
        response.displayUpdateButton = true
        if (league.status === "NS") {
            if (league.lookingForTeams === false) {
                response.displayTurnOnLookingForTeams = true
            } else {
                response.displayTurnOffLookingForTeams = true
            }
            if (!league.createdBy.equals(new ObjectId(userId))) {
                response.displayUnjoinButton = true
            }
            let startLeague = await hasPendingRequest("APLGS", userId, "", "", leagueId)
            if (startLeague !== null && startLeague.requestStatus === "ACTC") {
                if (startLeague.hasPending === false && league.teams.length >= 3) {    // Minimum is 3 teams to start league
                    response.displayStartLeagueButton = true
                }
                if (startLeague.hasPending === true) {
                    response.displayPendingStartLeagueInd = true
                }
            }
        }
    } else {
        if (league.status === "NS") {
            let joinLeague = await hasPendingRequest("APLGJ", userId, "", "", leagueId)
            if (joinLeague !== null && joinLeague.requestStatus === "ACTC") {
                if (joinLeague.hasPending === false && joinLeague.teamsCreated.length > 0 && league.lookingForTeams === true) {   // Must be an admin of a team of the same sport as league
                    response.displayJoinButton = true
                    response.teamsCreated = joinLeague.teamsCreated
                }
                if (joinLeague.hasPending === true) {
                    response.displayCancelReqButton = true
                    response.pendingRequestId = joinLeague.pendingRequestId
                }
            }
        }
    }

    return response
}

export const canUserCreateNewLeague = async function(userId) {
    let parms = await SysParmModel.findOne({ parameterId: "maxParms"}, {maxParms: 1}).exec();
    let maxLeaguesAllowed = parms.maxParms.maxActiveLeaguesCreated
    let activeLeaguesCreated = await LeagueModel.countDocuments({ createdBy : new ObjectId(userId) })
    if (activeLeaguesCreated < maxLeaguesAllowed) {
        return true
    } else {
        return false
    }    
}

export const createLeague = async function(data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = "648ba154251b78d7946df340"   // temp

    let validate = await leagueValidation(data, "NEW", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        let newLeague = new LeagueModel({
            leagueName: data.leagueName.trim(),
            status: "NS",
            location: data.location.trim(),
            division: data.division.trim(),
            description: data.description.trim(),
            sportsTypeId: data.sportsTypeId.trim(),
            ageGroup: data.ageGroup.trim(),
            numberOfTeams: data.numberOfTeams,
            numberOfRounds: data.numberOfRounds,
            startDate: data.startDate,
            endDate: data.endDate,
            lookingForTeams: false,
            createdBy: new ObjectId(userId)
            //logo: data.logo
            //banner: data.selectedBanner
        })
        await newLeague.save()
        .then(() => {
            response.requestStatus = "ACTC"
            response.league = newLeague
        })
        .catch((error) => {
            response.requestStatus = "RJCT"
            response.errMsg = error
        });
    }
    return response
}

export const updateLeague = async function(leagueId, data){
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = "648e0a6ff1915e7c19e2303a"   // temp

    data.leagueId = leagueId
    let validate = await leagueValidation(data, "CHG", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        await LeagueModel.updateOne({ _id: new ObjectId(leagueId)}, { 
            $set: { 
                leagueName: data.leagueName.trim(),
                location: data.location.trim(),
                division: data.division.trim(),
                description: data.description.trim(),
                sportsTypeId: data.sportsTypeId.trim(),
                ageGroup: data.ageGroup.trim(),
                numberOfTeams: data.numberOfTeams,
                numberOfRounds: data.numberOfRounds,
                startDate: data.startDate,
                endDate: data.endDate,
                lookingForTeams: false,
                updatedBy: new ObjectId(userId)
                //logo: data.logo
                //banner: data.selectedBanner
            } 
        })
        .then(() => {
            response.requestStatus = "ACTC"
        })
        .catch((error) => {
            response.requestStatus = "RJCT"
            response.errMsg = error
        });
    }
    return response
}

export const deleteLeague = async function(data) {
    // TEMP ONLY
    return ""
}

export const updateLeagueTeams = async function(data) {
    // TEMP ONLY
    return ""
}

export const isLeagueAdmin = async function(userId, leagueId) {

    if (userId.trim() === "" || leagueId.trim() === "") {
        return false
    }
    userId = userId.trim()
    leagueId = leagueId.trim()
    let league = await LeagueModel.findOne({ _id: new ObjectId(leagueId)}, {createdBy: 1, teams: 1, _id : 0}).exec();
    if (league === null) {
        return false
    }
    if (league.createdBy.equals(new ObjectId(userId))) {
        return true
    } else {
        let teamCreator;
        for (let i=0; i < league.teams.length; i++) {
            teamCreator = await UserModel.findOne({ "teamsCreated._id": league.teams[i].teamId }, {_id : 1}).exec()
            if (teamCreator._id.equals(new ObjectId(userId))) {
                return true
            }
        }
    }
    return false
}
  
export const leagueValidation = async function(data, requestType, userId) {

    let response = {requestStatus: "", errField: "", errMsg: ""}
    let ageGroupChars = /[0-9]-[0-9]/
    let canCreate = false;
    let isLeagueAdminInd = false
    let oldLeagueObject = null
    let sportDetails = null

    if (requestType != "NEW" && requestType != "CHG" && requestType != "DEL") {
        response.errMsg = 'Request type is invalid.'
        response.requestStatus = 'RJCT'
        return response
    } 
    if (requestType === "NEW") {
        canCreate =  await canUserCreateNewLeague(userId)
        if (!canCreate) {
            response.errMsg = 'Maximum allowed number of active leagues created is already reached.'
            response.requestStatus = 'RJCT'
            return response
        }
    }
    if (requestType !== "NEW") {
        oldLeagueObject =  await LeagueModel.findOne({ _id : new ObjectId(data.leagueId) })
        if (!oldLeagueObject) {
            response.errMsg = 'League is not found.'
            response.requestStatus = 'RJCT'
            return response
        }
    }
    if (requestType === "CHG") {
        isLeagueAdminInd =  await isLeagueAdmin(userId, data.leagueId)
        if (!isLeagueAdminInd) {
            response.errMsg = 'Not authorized to this page !!!'
            response.requestStatus = 'RJCT'
            return response
        }
    } 
    if (requestType === "DEL" && !oldLeagueObject.createdBy.equals(new ObjectId(userId)) ) {
        response.errMsg = 'Not authorized to delete this league.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "DEL" && (oldLeagueObject.teams.length !== 0 || oldLeagueObject.matches.length !== 0 || !oldLeagueObject.status.equals('EN')) ) {
        response.errMsg = 'League can not be deleted.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "CHG" && data.sportsTypeId.trim() != "" && !oldLeagueObject.sportsTypeId.equals(new ObjectId(data.sportsTypeId)) && oldLeagueObject.teams.length !== 0 ) {
        response.errMsg = 'Sports type cannot be amended.'
        response.requestStatus = 'RJCT'
        return response
    }  
    if (requestType != "DEL" && data.leagueName.trim() === "") {
        response.errMsg = 'League name is required.'
        response.errField = "leagueName"
        response.requestStatus = 'RJCT'
        return response
    } 
    if (requestType != "DEL" && data.sportsTypeId.trim() === "") {
        response.errMsg = 'Sport is required.'
        response.errField = "sport"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType !== "DEL") {
        sportDetails =  await SysParmModel.findOne({ _id : new ObjectId(data.sportsTypeId) })
        if (sportDetails === null) {
            response.errMsg = 'Sports type is not valid.'
            response.requestStatus = 'RJCT'
            return response
        }
    } 
    if (requestType != "DEL" && data.location.trim() === "") {
        response.errMsg = 'Location is required.'
        response.errField = "location"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && (data.startDate === null || data.startDate.trim() === "")) {
        response.errMsg = 'Start date is required.'
        response.errField = "startDate"
        response.requestStatus = 'RJCT'
        return response
    }
    let dateChecker = (dateToCheck) => {return (dateToCheck instanceof Date && !isNaN(dateToCheck))}
    if (requestType != "DEL" && !dateChecker(new Date(data.startDate))) {
        response.errMsg = 'Start date is invalid.'
        response.errField = "startDate"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && data.endDate === null  || data.endDate.trim() === "") {
        response.errMsg = 'End date is required.'
        response.errField = "endDate"
        response.requestStatus = 'RJCT'
        return response
    } 
    if (requestType != "DEL" && !dateChecker(new Date(data.endDate))) {
        response.errMsg = 'End date is invalid.'
        response.errField = "endDate"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && data.endDate < data.startDate) {
        response.errMsg = 'End date cannot be less than start date.'
        response.errField = "endDate"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && data.ageGroup.trim() === "") {
        response.errMsg = 'Age group is required.'
        response.errField = "ageGroup"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && !ageGroupChars.test(data.ageGroup.trim())){
        response.errMsg = 'Age group format is invalid.'
        response.errField = "ageGroup"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && Number(data.ageGroup.trim().substring(0,data.ageGroup.trim().indexOf("-"))) 
        > Number(data.ageGroup.trim().substring(data.ageGroup.trim().indexOf("-")+1))){
            response.errMsg = 'Age group value is invalid.'
            response.errField = "ageGroup"
            response.requestStatus = 'RJCT'
            return response
    }
    if (requestType != "DEL" && (data.numberOfTeams < 3 || isNaN(data.numberOfTeams) )) {
        response.errMsg = 'Number of teams cannot be less than 3.'
        response.errField = "numberOfTeams"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType != "DEL" && (data.numberOfRounds < 1 || isNaN(data.numberOfRounds) )) {
        response.errMsg = 'Number of rounds cannot be less than 1.'
        response.errField = "numberOfRounds"
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "CHG" && data.numberOfRounds !== oldLeagueObject.numberOfRounds && oldLeagueObject.status !== "NS" ) {
        response.errMsg = 'Number of rounds can no longer be changed.'
        response.errField = "numberOfRounds"
        response.requestStatus = 'RJCT'
        return response
    }
    response.requestStatus = 'ACTC'
    return response
}

export const getNSLeaguesUserIsAdmin = async function(userId) {
    let nsLeaguesUserIsAdmin = []
    if (userId.trim() === "" || userId === null) {
        return nsLeaguesUserIsAdmin
    }

    let sports = []
    let sportsParms = await getSportsList()
    if (sportsParms.requestStatus === 'ACTC') {
        sports = sportsParms.data
    }

    let sportsName
    let sportIndex = 0
    let listIndex = 0
    let teamsCreated = await getTeamsCreated(userId)
    if (teamsCreated.length > 0) {
        let leagues
        const promises = teamsCreated.map(async function(team) {
            leagues = await LeagueModel.find({ "teams.teamId": new ObjectId(team.teamId), status : "NS" }, { _id :1, leagueName : 1, sportsTypeId :  1 })
            let promises2 = leagues.map(async function(league) {
                listIndex = await nsLeaguesUserIsAdmin.findIndex((i) => i.leagueId.equals(league._id))
                if (listIndex === -1) {
                    sportIndex = await sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
                    sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
                    nsLeaguesUserIsAdmin.push({ leagueId: league._id, leagueName: league.leagueName, sportsTypeId: league.sportsTypeId, sportsName })
                }
            })
            await Promise.all(promises2);
        })
        await Promise.all(promises);
    }

    let leaguesCreated = await LeagueModel.find({ createdBy: new ObjectId(userId), status : { $ne : "EN"} }, { _id :1, leagueName : 1, sportsTypeId :  1 })
    let promises3 = leaguesCreated.map(async function(league) {
        listIndex = await nsLeaguesUserIsAdmin.findIndex((i) => i.leagueId.equals(league._id))
        if (listIndex === -1) {
            sportIndex = await sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
            sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
            nsLeaguesUserIsAdmin.push({ leagueId: league._id, leagueName: league.leagueName, sportsTypeId: league.sportsTypeId, sportsName })
        }
    })
    await Promise.all(promises3);

    return nsLeaguesUserIsAdmin
    
}

export const getOpenLeagues = async function() {
    let openLeagues = await LeagueModel.aggregate([ { $match: { lookingForTeams : true, status : "NS" } }, 
        { 
            $project: {
                leagueId: "$_id", leagueName : 1, indicatorChgTmst: "$lookingForTeamsChgTmst", _id : 0
            }
        }, {
            $sort: { indicatorChgTmst : -1}
        }
    ]).limit(10)

    let parm = await SysParmModel.findOne({ parameterId: "dfltAnnouncement"}, {dfltAnnouncement : 1}).exec();
    let dfltLeagueMsg = parm.dfltAnnouncement.defaultMsgLeagueAncmt
    let startPos = dfltLeagueMsg.indexOf("&leagueName")
    let endPos = dfltLeagueMsg.indexOf(" ", startPos)
    let startString = ""
    let endString = ""
    if (startPos > 0) {
         startString = dfltLeagueMsg.substring(0,startPos)
    }
    if (endPos > 0 && endPos !== -1) {
        endString = dfltLeagueMsg.substring(endPos)
    }

    for (let i=0; i < openLeagues.length; i++) {
        openLeagues[i].leagueMsg = startString + openLeagues[i].leagueName + endString
    }

    return openLeagues
}

export const updateLookingForTeams = async function(userId, leagueId, indicator) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (userId.trim() === "" || leagueId.trim() === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid entry parameters"
        return response
    }
    let resp1 = await getLeagueDetails(leagueId)
    let resp2 = isLeagueAdmin(userId, leagueId)
    const [leagueDetails, admin] = await Promise.all([resp1, resp2])
    if (leagueDetails.requestStatus !== "ACTC") {
        return leagueDetails
    }
    if (!admin ) {
        response.requestStatus = "RJCT"
        response.errMsg = "Not authorized to league."
        return response
    }
    if (leagueDetails.details.status !== "NS") {
        response.requestStatus = "RJCT"
        response.errMsg = "Can no longer change indicator."
        return response
    }
    if (leagueDetails.details.lookingForTeams === indicator) {
        response.requestStatus = "RJCT"
        response.errMsg = "No necessary change found."
        return response
    }
    await LeagueModel.updateOne({ _id: new ObjectId(leagueId)}, { 
        $set: { 
            lookingForTeams: indicator,
            lookingForTeamsChgBy: new ObjectId(userId),
            lookingForTeamsChgTmst: getTimestamp(0)
        } 
    })
    .then(() => {
        response.requestStatus = "ACTC"
    })
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
    });
    return response
}

export const joinLeague = async function(userId, teamId, leagueId, msg) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let notifId = "APLGJ"

    if (userId === null || userId.trim() === "" || teamId === null || teamId.trim() === "" || leagueId === null || leagueId.trim() === "") {
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

    if (userId === null || userId.trim() === "" || leagueId === null || leagueId.trim() === "") {
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
    // TO DO - remove all pending notifs to userId that is related to that leagueId !!!!!

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

export const getLeagueAdmins = async function(leagueId) {
    let admins = []
    if (leagueId === null || leagueId.trim() === "") {
        return admins
    }

    let league = await LeagueModel.findOne({ _id: new ObjectId(leagueId)}, {createdBy: 1, teams: 1, _id : 0}).exec();
    if (league === null) {
        return admins
    }
    admins.push({role: "League Creator", userId: league.createdBy})

    let teamAdmin
    const promises = league.teams.map(async function(team) {
        teamAdmin = await getTeamAdmin(team.teamId.toString())
        if (teamAdmin !== "") {
            admins.push({role: "Team Creator", userId: teamAdmin, teamId: team.teamId})
        }
    })
    await Promise.all(promises);
    return admins
}

const getTimestamp = (daysToAdd) => {
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }