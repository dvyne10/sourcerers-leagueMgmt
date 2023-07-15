import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";

let ObjectId = mongoose.Types.ObjectId;

export const createLeague = async function(data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = new ObjectId("648ba153251b78d7946df30d")   // temp

    if (!canUserCreateNewLeague(userId)) {
        response.requestStatus = 'RJCT'
        response.errMsg = "Maximum allowed number of active leagues created is already reached."
        return response
    }

    let validate = leagueValidation(data, "NEW", userId)

    if (validate.requestStatus !== "") {
        response = validate
    } else {
        data.status = "NS"
        data.lookingForTeams = false
        data.lookingForTeamsChgBy = new ObjectId("648ba153251b78d7946df311")
        data.createdBy = new ObjectId("648ba153251b78d7946df311")
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
    let userId = new ObjectId("648ba153251b78d7946df311")   // temp

    console.log(44)
    if (!isLeagueAdmin(userId, leagueId)) {
        response.requestStatus = 'RJCT'
        response.errMsg = "Not authorized to this page !!!"
        return response
    }

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
    if (data.leagueName.trim() === "") {
        response.errMsg = 'League name is required.'
        response.errField = "leagueName"
    } else if (data.sportsTypeId === "") {
        response.errMsg = 'Sport is required.'
        response.errField = "sport"
    } else if (data.location.trim() === "") {
        response.errMsg = 'Location is required.'
        response.errField = "location"
    } else if (data.startDate === null || data.startDate.trim() === "" ) {
        response.errMsg = 'Start date is required.'
        response.errField = "startDate"
    } else if (isNaN(Date.parse(data.startDate))) {
        response.errMsg = 'Start date is invalid.'
        response.errField = "startDate"
    } else if (data.endDate === null  || data.endDate.trim() === "") {
        response.errMsg = 'End date is required.'
        response.errField = "endDate"
    } else if (isNaN(Date.parse(data.endDate))) {
        response.errMsg = 'End date is invalid.'
        response.errField = "endDate"
    } else if (data.endDate < data.startDate) {
        response.errMsg = 'End date cannot be less than start date.'
        response.errField = "endDate"
    } else if (data.ageGroup.trim() === "") {
        response.errMsg = 'Age group is required.'
        response.errField = "ageGroup"
    } else if (!ageGroupChars.test(data.ageGroup.trim())){
        response.errMsg = 'Age group format is invalid.'
        response.errField = "ageGroup"
    } else if (Number(data.ageGroup.trim().substring(0,data.ageGroup.trim().indexOf("-"))) 
        > Number(data.ageGroup.trim().substring(data.ageGroup.trim().indexOf("-")+1))){
            response.errMsg = 'Age group value is invalid.'
            response.errField = "ageGroup"
    } else if (data.numberOfTeams < 3) {
        response.errMsg = 'Number of teams cannot be less than 3.'
        response.errField = "numberOfTeams"
    } else if (data.numberOfRounds < 1) {
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
    return false
}

export const updateLeagueTeams = async function(data) {
    // TEMP ONLY
    return false
}

export const canUserCreateNewLeague = async function(userId) {
    // TEMP ONLY
    return false
}

export const isLeagueAdmin = async function(userId, leagueId) {

    let league = await LeagueModel.findOne({ _id: new ObjectId(leagueId)}, {createdBy: 1, teams: 1, _id : 0}).exec();
    if (league === null) {
        return false
    }
    if (league.createdBy.equals(userId)) {
        return true
    } else {
        console.log(148)
        let teamCreator;
        console.log(league.teams.length)
        for (let i=0; i < league.teams.length; i++) {
            teamCreator = await UserModel.findOne({ "teamsCreated._id": league.teams[i].teamId }, {_id : 1}).exec()
            if (teamCreator._id.equals(userId)) {
                return true
            }
        }
    }
    return false
}