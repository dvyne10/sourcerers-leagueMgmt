import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";

let ObjectId = mongoose.Types.ObjectId;

export const createLeague = async function(data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = new ObjectId("648ba154251b78d7946df340")   // temp

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
    let userId = new ObjectId("648e0a6ff1915e7c19e2303a")   // temp

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

    if (userId.trim() === "" || leagueId.trim() === "") {
        return false
    }
    userId = userId.trim()
    leagueId = leagueId.trim()
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