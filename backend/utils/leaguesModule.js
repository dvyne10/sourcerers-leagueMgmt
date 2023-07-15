import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";

let ObjectId = mongoose.Types.ObjectId;

export const createLeague = async function(data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = new ObjectId("648ba154251b78d7946df338")   // temp

    let validate = await leagueValidation(data, "NEW", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        data.status = "NS"
        data.lookingForTeams = false
        data.createdBy = new ObjectId(userId)
        let newLeague = new LeagueModel(data);
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
    let userId = new ObjectId("648e0a6ff1915e7c19e2303a")   // temp

    data.leagueId = leagueId
    let validate = await leagueValidation(data, "CHG", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        await LeagueModel.updateOne({ _id: new ObjectId(leagueId)}, { 
            $set: {
                leagueName: data.leagueName,
                description: data.description,
                location: data.location,
                division: data.division,
                startDate: data.startDate,
                endDate: data.endDate,
                ageGroup: data.ageGroup,
                numberOfTeams: data.numberOfTeams,
                numberOfRounds: data.numberOfRounds,
                sportsTypeId: data.sportsTypeId,
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
    }
    if (requestType === "NEW" && !canCreate) {
        response.errMsg = 'Maximum allowed number of active leagues created is already reached.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType !== "NEW") {
        oldLeagueObject =  await LeagueModel.findOne({ _id : new ObjectId(data.leagueId) })
    }
    if (requestType !== "NEW" && !oldLeagueObject) {
        response.errMsg = 'League is not found.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "CHG") {
        isLeagueAdminInd =  await isLeagueAdmin(userId, data.leagueId)
        if (!isLeagueAdminInd) {
            response.errMsg = 'Not authorized to this page !!!'
            response.requestStatus = 'RJCT'
            return response
        }
    } 
    if (requestType === "DEL" && !oldLeagueObject.createdBy.equals(userId) ) {
        response.errMsg = 'Not authorized to delete this league.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "DEL" && (oldLeagueObject.teams.length !== 0 || oldLeagueObject.matches.length !== 0 || !oldLeagueObject.status.equals('EN')) ) {
        response.errMsg = 'League can not be deleted.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "CHG" && !oldLeagueObject.sportsTypeId.equals(new ObjectId(data.sportsTypeId)) && oldLeagueObject.teams.length !== 0 ) {
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
    if (requestType != "DEL" && data.sportsTypeId === "") {
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
    if (requestType != "DEL" && isNaN(Date.parse(data.startDate))) {
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
    if (requestType != "DEL" && isNaN(Date.parse(data.endDate))) {
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
    response.requestStatus = 'ACTC'
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

export const isLeagueAdmin = async function(userId, leagueId) {

    let league = await LeagueModel.findOne({ _id: new ObjectId(leagueId)}, {createdBy: 1, teams: 1, _id : 0}).exec();
    if (league === null) {
        return false
    }
    if (league.createdBy.equals(userId)) {
        return true
    } else {
        let teamCreator;
        for (let i=0; i < league.teams.length; i++) {
            teamCreator = await UserModel.findOne({ "teamsCreated._id": league.teams[i].teamId }, {_id : 1}).exec()
            if (teamCreator._id.equals(userId)) {
                return true
            }
        }
    }
    return false
}