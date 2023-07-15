import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getSysParm } from "./sysParmModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const createLeague = async function(data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = new ObjectId("648ba154251b78d7946df338")   // temp

    let validate = leagueValidation(data, "NEW", userId)

    if (validate.requestStatus !== "") {
        response = validate
    } else {
        data.status = "NS"
        data.lookingForTeams = false
        data.createdBy = new ObjectId(userId)
        let newLeague = new LeagueModel(data);
        await newLeague.save()
        .then(function () {
            response.requestStatus = "ACTC"
            response.league = newLeague
        })
        .catch(function (error) {
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
    let validate = leagueValidation(data, "CHG", userId)

    if (validate.requestStatus !== "") {
        response = validate
    } else {
        await LeagueModel.updateOne({ _id: new ObjectId(leagueId)}, { 
            $set: {
                leagueName: data.leagueName,
                description: data.description,
                location: data.location,
                divison: data.division,
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
        .then(function () {
            response.requestStatus = "ACTC"
        })
        .catch(function (error) {
            response.requestStatus = "RJCT"
            response.errMsg = error
        });
    }
    return response
}
  
export const leagueValidation = (data, requestType, userId) => {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let ageGroupChars = /[0-9]-[0-9]/
    let canCreate = true; //temp :should be init to false
    if (requestType === "NEW") {
        canUserCreateNewLeague(userId)
        .then(resp => {
            canCreate = resp
        })
    }
    let isLeagueAdminInd = false
    if (requestType === "CHG") {
        isLeagueAdmin((userId, data.leagueId))
        .then(resp => {
            isLeagueAdminInd = resp
        })
    }
    if (requestType != "NEW" && requestType != "CHG" && requestType != "DEL") {
        response.errMsg = 'Request type is invalid.'
    } else if (requestType === "NEW" && !canCreate) {
        response.errMsg = 'Maximum allowed number of active leagues created is already reached.'
    } else if (requestType === "CHG" && !isLeagueAdminInd) {
        response.errMsg = 'Not authorized to this page !!!'
    } else if (requestType != "DEL" && data.leagueName.trim() === "") {
        response.errMsg = 'League name is required.'
        response.errField = "leagueName"
    } else if (requestType != "DEL" && data.sportsTypeId === "") {
        response.errMsg = 'Sport is required.'
        response.errField = "sport"
    } else if (requestType != "DEL" && data.location.trim() === "") {
        response.errMsg = 'Location is required.'
        response.errField = "location"
    } else if (requestType != "DEL" && (data.startDate === null || data.startDate.trim() === "")) {
        response.errMsg = 'Start date is required.'
        response.errField = "startDate"
    } else if (requestType != "DEL" && isNaN(Date.parse(data.startDate))) {
        response.errMsg = 'Start date is invalid.'
        response.errField = "startDate"
    } else if (requestType != "DEL" && data.endDate === null  || data.endDate.trim() === "") {
        response.errMsg = 'End date is required.'
        response.errField = "endDate"
    } else if (requestType != "DEL" && isNaN(Date.parse(data.endDate))) {
        response.errMsg = 'End date is invalid.'
        response.errField = "endDate"
    } else if (requestType != "DEL" && data.endDate < data.startDate) {
        response.errMsg = 'End date cannot be less than start date.'
        response.errField = "endDate"
    } else if (requestType != "DEL" && data.ageGroup.trim() === "") {
        response.errMsg = 'Age group is required.'
        response.errField = "ageGroup"
    } else if (requestType != "DEL" && !ageGroupChars.test(data.ageGroup.trim())){
        response.errMsg = 'Age group format is invalid.'
        response.errField = "ageGroup"
    } else if (requestType != "DEL" && Number(data.ageGroup.trim().substring(0,data.ageGroup.trim().indexOf("-"))) 
        > Number(data.ageGroup.trim().substring(data.ageGroup.trim().indexOf("-")+1))){
            response.errMsg = 'Age group value is invalid.'
            response.errField = "ageGroup"
    } else if (requestType != "DEL" && (data.numberOfTeams < 3 || isNaN(data.numberOfTeams) )) {
        response.errMsg = 'Number of teams cannot be less than 3.'
        response.errField = "numberOfTeams"
    } else if (requestType != "DEL" && (data.numberOfRounds < 1 || isNaN(data.numberOfRounds) )) {
        response.errMsg = 'Number of rounds cannot be less than 1.'
        response.errField = "numberOfRounds"
    }
    if (response.errMsg !== "") {
        response.requestStatus = 'RJCT'
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

export const canUserCreateNewLeague = async function(userId) {
    let parms = await SysParmModel.findOne({ parameterId: "maxParms"}, {maxParms: 1}).exec();
    let maxLeaguesAllowed = parms.maxParms.maxActiveLeaguesCreated
    let activeLeaguesCreated = await LeagueModel.countDocuments({ createdBy : new ObjectId(userId) })
    if (activeLeaguesCreated < maxLeaguesAllowed) {
        return true
    } else {
        return false
    }
    // let parms
    // getSysParm("maxParms")
    // .then(async function(parm) {
    //     let maxLeaguesAllowed = parm.data.maxParms.maxActiveLeaguesCreated
    //     let activeLeaguesCreated = await LeagueModel.countDocuments({ createdBy : new ObjectId(userId) })
    //     if (activeLeaguesCreated < maxLeaguesAllowed) {
    //         return true
    //     } else {
    //         return false
    //     }   
    // })     
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