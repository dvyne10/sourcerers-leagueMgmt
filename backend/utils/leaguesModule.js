import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";

let ObjectId = mongoose.Types.ObjectId;

export const createleague = async function(data){
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = new ObjectId("648ba153251b78d7946df30d")   // temp

    if (!canUserCreateNewLeague(userId)) {
        response.requestStatus = 'RJCT'
        response.errMsg = 'User cannot create new leagues for the meantime.'
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
    } else if (data.startDate === null) {
        response.errMsg = 'Start date is required.'
        response.errField = "startDate"
    } else if (isNaN(Date.parse(data.startDate))) {
        response.errMsg = 'Start date is invalid.'
        response.errField = "startDate"
    } else if (data.endDate === null) {
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
            response.errMsg = 'Age group format is invalid.'
            response.errField = "ageGroup"
    } else if (data.numberOfTeams === 0) {
        response.errMsg = 'Number of teams cannot be zero.'
        response.errField = "numberOfTeams"
    } else if (data.numberOfRounds === 0) {
        response.errMsg = 'Number of rounds cannot be zero.'
        response.errField = "numberOfRounds"
    }

    if (response.errMsg !== "") {
        response.requestStatus = 'RJCT'
    }
    return response
}

export const canUserCreateNewLeague = (userId) => {
    // TEMP ONLY
    return true
}

export const isLeagueAdmin = (userId, leagueId) => {
    // TEMP ONLY
    return false
}