import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getUserFullname } from "./usersModule.js";
import { getManyTeamNames, getTeamsCreated, getTeamAdmin } from "./teamsModule.js";
import { hasPendingRequest } from "./requestsModule.js";
import { getSportsList, getSportName } from "./sysParmModule.js";

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
            $sort: { status : -1, totalPoints: -1}
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
    let league = getLeagueDetails(leagueId)
    let leagueButtons = getLeagueButtons(userId, leagueId)
    let [leagueDetails, leagueButtonsInd] = await Promise.all([league, leagueButtons])
    leagueDetails = {...leagueDetails, buttons: leagueButtonsInd}
    return leagueDetails
}

export const getLeagueDetails = async function(leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(leagueId.trim())) {
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
    let totalPts = getTeamLeaguePoints(league.matches)

    const [teamNames, leagueSportName, teamPoints] = await Promise.all([teams, sportsName, totalPts])

    let teamDetails = teamNames.map((team) => {
        let idx = teamPoints.findIndex(i => i.teamId.equals(team.teamId))
        if (idx !== -1) {
            return { ...team, totalLeaguePts: teamPoints[idx].points, totalScore: teamPoints[idx].score  }
        } else {
            return { ...team, totalLeaguePts : 0, totalScore : 0}
        }
    })
    teamDetails.sort((a, b) => {
        var orderPoints = b.totalLeaguePts - a.totalLeaguePts
        var orderScore = b.totalScore - a.totalScore
        return orderPoints || orderScore
    })
    const leagueWithdetails = { ...league, teams : teamDetails, sportsName: leagueSportName };

    response.requestStatus = "ACTC"
    response.details = leagueWithdetails
    return response
}

export const getLeagueButtons = async function(userId, leagueId) {
    let response = { displayUpdateButton : false, displayTurnOnLookingForTeams: false, displayTurnOffLookingForTeams : false, 
        displayUnjoinButton: false, displayJoinButton: false, teamsCreated: [],  displayCancelReqButton: false, pendingRequestId : "", 
        displayStartLeagueButton: false, minApprovals: 999, displayPendingStartLeagueInd: false, pendingStartLeagueRequestId : "" }

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
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
                    response.minApprovals = startLeague.minApprovals
                }
                if (startLeague.hasPending === true) {
                    response.displayPendingStartLeagueInd = true
                    response.pendingStartLeagueRequestId = startLeague.pendingStartLeagueRequestId
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

export const getTeamLeaguePoints = async function(matches) {

    const promises = matches.reduce((acc, cur) => {
        let item1 = acc.find(({ teamId }) => teamId.equals(cur.team1.teamId))
        if (item1) {
            item1.points += cur.team1.leaguePoints 
            item1.score += cur.team1.finalScore 
        } else {
            acc.push({ teamId: cur.team1.teamId, points: cur.team1.leaguePoints, score: cur.team1.finalScore })
        }
        let item2 = acc.find(({ teamId }) => teamId.equals(cur.team2.teamId))
        if (item2) {
            item2.points += cur.team2.leaguePoints 
            item2.score += cur.team2.finalScore 
        } else {
            acc.push({ teamId: cur.team2.teamId, points: cur.team2.leaguePoints, score: cur.team2.finalScore })
        }
        return acc
    }, [])  
    const totalPoints = await Promise.all(promises)
    return totalPoints
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

export const createLeague = async function(userId, data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

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

export const getLeagueDetailsForUpdate = async function(userId, leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }
    if (!mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "League Id is required."
        return response
    }
    let isLeagueAdminInd =  await isLeagueAdmin(userId, leagueId)
    if (!isLeagueAdminInd) {
        response.requestStatus = 'RJCT'
        response.errMsg = 'Not authorized to this page !!!'
        return response
    }
    let resp1 = getLeagueDetails(leagueId)
    let resp2 = getSportsList()
    let [leagueDetails, sportOptions] = await Promise.all([resp1, resp2])

    if (leagueDetails.requestStatus !== "ACTC") {
        response.requestStatus = "RJCT"
        response.errMsg = "League is not found."
        return response
    } else {
        let detailsForUpdate = leagueDetails.details
        let teamHasPending, approverName
        let teamsForUpdate = []
        let allowTeamRemoval = false
        if (detailsForUpdate.status === "NS" && allowTeamRemoval) {
            let promise = detailsForUpdate.teams.map(async function(team) { 
                teamHasPending = await hasPendingRequest("APLGR", userId, "", team.teamId.toString(), leagueId)
                if (teamHasPending.requestStatus === "ACTC" && teamHasPending.hasPending === true) {
                    return {teamId: team.teamId, teamName:team.teamName, joinedTimestamp: team.joinedTimestamp, approvedBy: team.approvedBy, action: null}
                } else {
                    return {teamId: team.teamId, teamName:team.teamName, joinedTimestamp: team.joinedTimestamp, approvedBy: team.approvedBy, action: "Remove"}
                }
            })
            teamsForUpdate = await Promise.all(promise)
        }

        let promise2 = detailsForUpdate.teams.map(async function(team) { 
            approverName = await getUserFullname(team.approvedBy.toString(), "")
            teamsForUpdate.push({teamId: team.teamId, teamName:team.teamName, joinedTimestamp: team.joinedTimestamp, approvedBy: approverName.fullName})
        })
        await Promise.all(promise2)
        
        response.requestStatus = "ACTC"
        if (detailsForUpdate.status !== "NS" || detailsForUpdate.teams.length > 0 || 
            detailsForUpdate.matches.length > 0 || !detailsForUpdate.createdBy.equals(userId)) {
                response.details = {...detailsForUpdate, matches: null, teams: teamsForUpdate, sportOptions: sportOptions.data, allowDelete: false, allowTeamRemoval}
        } else {
            response.details = {...detailsForUpdate, matches: null, teams: teamsForUpdate, sportOptions: sportOptions.data, allowDelete: true, allowTeamRemoval}
        }
        return response
    }
}

export const updateLeague = async function(userId, leagueId, data){
    let response = {requestStatus: "", errField: "", errMsg: ""}

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

export const deleteLeague = async function(userId, leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let data = {leagueId}
    let validate = await leagueValidation(data, "DEL", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        await LeagueModel.deleteOne({ _id: new ObjectId(leagueId)})
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

export const isLeagueAdmin = async function(userId, leagueId) {

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
        return false
    }
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
    if (requestType === "DEL" && (oldLeagueObject.teams.length !== 0 || oldLeagueObject.matches.length !== 0 || oldLeagueObject.status === "EN") ) {
        response.errMsg = 'League cannot be deleted.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "CHG" && data.sportsTypeId.trim() != "" && !oldLeagueObject.sportsTypeId.equals(new ObjectId(data.sportsTypeId)) && oldLeagueObject.teams.length !== 0 ) {
        response.errMsg = 'Sports type cannot be amended.'
        response.requestStatus = 'RJCT'
        return response
    }  
    if (requestType !== "DEL" && data.leagueName.trim() === "") {
        response.errMsg = 'League name is required.'
        response.errField = "leagueName"
        response.requestStatus = 'RJCT'
        return response
    } 
    if (requestType !== "DEL" && data.sportsTypeId.trim() === "") {
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
    if (requestType != "DEL" && (data.endDate === null  || data.endDate.trim() === "")) {
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
    if (!mongoose.isValidObjectId(userId.trim())) {
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
                listIndex = nsLeaguesUserIsAdmin.findIndex((i) => i.leagueId.equals(league._id))
                if (listIndex === -1) {
                    sportIndex = sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
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
        listIndex = nsLeaguesUserIsAdmin.findIndex((i) => i.leagueId.equals(league._id))
        if (listIndex === -1) {
            sportIndex = sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
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

    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(leagueId.trim())) {
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

export const getLeagueAdmins = async function(leagueId) {
    let admins = []
    if (!mongoose.isValidObjectId(leagueId.trim())) {
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

export const getLeaguesCreated = async function(userId) {
    let leaguesCreated = await LeagueModel.aggregate([
        { $match : {createdBy : new ObjectId(userId) } }, 
        { $project: { _id: 0, leagueId: "$_id", leagueName : 1, sportsTypeId : 1, status : 1 } }
    ])
    if (leaguesCreated === null || leaguesCreated.length === 0) {
        return []
    } else {
        return leaguesCreated
    }    
}

export const getTeamActiveLeagues = async function(teamId){
    if (!mongoose.isValidObjectId(teamId.trim())) {
        return []
    }
    let leagues = await LeagueModel.aggregate([ { $match: { "teams.teamId" : new ObjectId(teamId), status : {$ne : "EN"} } }, 
        { 
            $project: {
                leagueId: "$_id", _id: 0, leagueName : 1, "teams.teamId" : 1, sportsTypeId: 1
            }
        }
    ])

    const promises = leagues.map((league) => {
        return getManyTeamNames(league.teams).then((teams) => {
          return { ...league, teams };
        });
      });
    
    const leaguesWithTeamNames = await Promise.all(promises);
    return leaguesWithTeamNames
}

export const getLeagueMajorDetails = async function(leagueId){
    if (!mongoose.isValidObjectId(leagueId.trim())) {
        return null
    }
    let leagueDetails = await LeagueModel.findOne({ _id: new ObjectId(leagueId) }, 
        { teams: 0, matches: 0 })
    return leagueDetails
}

const getTimestamp = (daysToAdd) => {
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }