import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";

import { genHash, genSalt } from "./auth.utils.js";
import { isValidPassword } from "../controllers/userController.js";
import { getUserFullname } from "./usersModule.js";
import { getUsersTeams, getTeamsCreated, } from "./teamsModule.js";
import { getLeagueDetails, getLeaguesCreated, getTeamActiveLeagues } from "./leaguesModule.js";
import { hasPendingRequest } from "./requestsModule.js";
import { getSportsList, getSportName, getSysParmById, getPosnAndStatBySport } from "./sysParmModule.js";
import systemParameterModel from "../models/systemParameter.model.js";

let ObjectId = mongoose.Types.ObjectId;
const userStatus = [ {desc: "Active", code: "ACTV"}, {desc: "Banned", code: "BAN"},
        {desc: "Suspended", code: "SUSP"}, {desc: "Locked", code: "LOCK"}, {desc: "Pending", code: "PEND"} ]

export const adminGetUsers = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let users = await UserModel.aggregate([
        {
            $addFields: {
                userId: "$_id",
                fullName: {
                    $reduce: {
                        input: [ "$firstName", " ", "$lastName" ],
                        initialValue: "",
                        in: {
                            $concat: [ "$$value", "$$this"]
                        }
                    }
                }, 
            },
        },
        {
            $project: {
                _id: 0, status: 1, userId: 1, userName: 1, fullName: 1, email : 1, userType: 1
            }
        }
    ])
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (users.length === 0) {
        response.requestStatus = "ACTC"
        response.errMsg = "No data found"
        response.details = []
        return response
    }

    response.requestStatus = "ACTC"
    response.details = users
    return response
}

export const adminGetUserDetails = async function(userId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }
 
    let user = await UserModel.findOne({_id: new ObjectId(userId)})
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (user === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }
    
    response.requestStatus = "ACTC"
    response.details = user
    return response
}

export const adminCreateUser = async function(details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let valid = userValidation(details)
    if (valid.requestStatus !== "ACTC") {
        return valid
    }

    let existingUsername = await UserModel.findOne({ userName: new RegExp(`^${details.userName}$`, "i") });
    if (existingUsername !== null) {
        response.requestStatus = "RJCT"
        response.errMsg = "Username is not available"
        return response
    }

    let existingEmail = await UserModel.findOne({ email: new RegExp(`^${details.email}$`, "i") });
    if (existingEmail !== null) {
        response.requestStatus = "RJCT"
        response.errMsg = "Email is not available"
        return response
    }

    let passwordCheck = await isValidPassword(details.password);
    if (!passwordCheck.valid) {
        response.requestStatus = "RJCT"
        response.errMsg = passwordCheck.errMsg
        return response
    }

    const salt = genSalt();
    const hashedPassword = genHash(details.password, salt);

    let user = new UserModel({
            status: 'ACTV',
            userName: details.userName,
            email: details.email,
            password: hashedPassword,
            salt: salt,
            userType: details.userType,
            phoneNumber: details.phoneNumber,
            firstName: details.firstName,
            lastName: details.lastName,
            country: details.country,
            province: details.province,
            city: details.city,
            sportsOfInterest: details.sportsOfInterest,
    })
    await user.save()
    .then(() => {
        response.requestStatus = "ACTC"
    })
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
    });
    return response
}

export const adminUpdateUser = async function(userId, details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    
    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }

    let valid = userValidation(details)
    if (valid.requestStatus !== "ACTC") {
        return valid
    }

    const existingUser = await UserModel.findOne({ _id : new ObjectId(userId) });
    if (existingUser === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "User is not found"
        return response
    }

    if (existingUser.userName !== details.userName) {
        const existingUsername = await UserModel.findOne({ userName: new RegExp(`^${details.userName}$`, "i") });
        if (existingUsername !== null) {
            response.requestStatus = "RJCT"
            response.errMsg = "Username is not available"
            return response
        }
    }
    
    if (existingUser.email !== details.email) {
        const existingEmail = await UserModel.findOne({ userName: new RegExp(`^${details.email}$`, "i") });
        if (existingEmail !== null) {
            response.requestStatus = "RJCT"
            response.errMsg = "Email is not available"
            return response
        }
    }
    
    let salt = existingUser.salt
    let hashedPassword = existingUser.password
    if (hashedPassword !== details.password) {
        let passwordCheck = await isValidPassword(details.password)
        if (!passwordCheck.valid) {
            response.requestStatus = "RJCT"
            response.errMsg = passwordCheck.errMsg
            return response
        }
        salt = genSalt();
        hashedPassword = genHash(details.password, salt)
    }

    let user = await UserModel.updateOne({ _id : new ObjectId(userId)}, {
        $set: { 
            status: details.status,
            userName: details.userName,
            email: details.email,
            password: hashedPassword,
            salt: salt,
            userType: details.userType,
            phoneNumber: details.phoneNumber,
            firstName: details.firstName,
            lastName: details.lastName,
            country: details.country,
            province: details.province,
            city: details.city,
            sportsOfInterest: details.sportsOfInterest,
            announcementsCreated: details.userType === "ADMIN" ? details.announcementsCreated : [],
            successfulLoginDetails: details.successfulLoginDetails,
            failedLoginDetails: details.failedLoginDetails,
            detailsOTP: details.detailsOTP
        } 
    })
    if (user.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Account update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

export const adminDeleteUser = async function(userId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }

    const user = await UserModel.deleteOne({ _id : new ObjectId(userId) });
    if (user.deletedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Account deletion was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

const userValidation = function(details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (!details.userName || details.userName === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Username is required"
        return response
    }
    if (!details.password || details.password === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Password is required"
        return response
    }
    if (!details.userType || details.userType === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Role is required"
        return response
    }
    if (!details.email || details.email === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Email is required"
        return response
    }
    if ((!details.sportsOfInterest || details.sportsOfInterest.length === 0) && details.userType !== "ADMIN") {
        response.requestStatus = "RJCT"
        response.errMsg = "Sports of interest is required for regular users"
        return response
    }
    if (!details.firstName || details.firstName === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "First name is required"
        return response
    }
    if (!details.lastName || details.lastName === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Last name is required"
        return response
    }
    if ((!details.country || details.country === "") && details.userType !== "ADMIN") {
        response.requestStatus = "RJCT"
        response.errMsg = "Country is required for regular users"
        return response
    }
    if ((!details.province || details.province === "") && details.userType !== "ADMIN") {
        response.requestStatus = "RJCT"
        response.errMsg = "Province is required for regular users"
        return response
    }
    if ((!details.city || details.city === "") && details.userType !== "ADMIN") {
        response.requestStatus = "RJCT"
        response.errMsg = "City is required for regular users"
        return response
    }
    response.requestStatus = "ACTC"
    return response
}

export const adminGetTeams = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let allTeams = await UserModel.find({teamsCreated : { $ne : null}}, {_id: 0, teamsCreated : 1})

    if (allTeams.length === 0) {
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

    let sportIndex, sportsName
    let teams = []
    allTeams.map(user => {
        user.teamsCreated.map(team => {
            sportIndex = sports.findIndex((i) => i.sportsId.equals(team.sportsTypeId))
            sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
            teams.push({teamId: team._id, teamName: team.teamName, location: team.location, division: team.division, sport: sportsName})
        })
    })

    response.requestStatus = "ACTC"
    response.details = teams
    return response
}

export const adminGetTeamDetails = async function(teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team Id is required."
        return response
    }
 
    let team = await UserModel.findOne({"teamsCreated._id": new ObjectId(teamId)}, { 
        "teamsCreated.$": 1, _id : 1
    })

    if (team === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    let createdBy = team._id
    team = team.teamsCreated[0]
    let sportDetails = await getPosnAndStatBySport(team.sportsTypeId.toString())
    team = {teamName: team.teamName, sportsTypeId: team.sportsTypeId, description: team.description, 
        location: team.location, division: team.division, teamContactEmail: team.teamContactEmail, 
        players: team.players, lookingForPlayers: team.lookingForPlayers, lookingForPlayersChgTmst: team.lookingForPlayersChgTmst,
        createdAt: team.createdAt, updatedAt: team.updatedAt, createdBy, positionOptions: sportDetails.positions}

    response.requestStatus = "ACTC"
    response.details = team
    return response
}

export const adminCreateTeam = async function(details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!details.newCreatorId || !mongoose.isValidObjectId(details.newCreatorId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team creator is required."
        return response
    }

    let valid = teamValidation(details)
    if (valid.requestStatus !== "ACTC") {
        return valid
    }

    let newTeam = await UserModel.updateOne({_id : new ObjectId(details.newCreatorId)}, {
        $push: { teamsCreated : {
            teamName: details.teamName,
            sportsTypeId: details.sportsTypeId,
            description: details.description,
            location: details.location,
            division: details.division,
            teamContactEmail: details.teamContactEmail,
            lookingForPlayers: false,
        } } 
    })
    if (!newTeam.modifiedCount || newTeam.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Creation was not successful"
    } else {
        response.requestStatus = "ACTC"
    }

    return response
}

export const adminUpdateTeam = async function(teamId, details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    
    if (!mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team Id is required."
        return response
    }

    let currentTeamDetails = await UserModel.findOne({"teamsCreated._id": new ObjectId(teamId)}, { 
        "teamsCreated.$": 1, _id: 1
    })
    if (currentTeamDetails === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team not found"
        return response
    }

    let valid = teamValidation(details)
    if (valid.requestStatus !== "ACTC") {
        return valid
    }

    let teamUpdate
    if (details.newCreatorId === "" || currentTeamDetails._id.equals(new ObjectId(details.newCreatorId))) {
        teamUpdate = await UserModel.updateOne({"teamsCreated._id" : new ObjectId(teamId) }, { 
            $set: { "teamsCreated.$[n1].teamName": details.teamName, 
                    "teamsCreated.$[n1].sportsTypeId": details.sportsTypeId, 
                    "teamsCreated.$[n1].description": details.description,
                    "teamsCreated.$[n1].location": details.location,
                    "teamsCreated.$[n1].division": details.division,
                    "teamsCreated.$[n1].teamContactEmail": details.teamContactEmail,
                    "teamsCreated.$[n1].players": details.players,
                    "teamsCreated.$[n1].lookingForPlayers": details.lookingForPlayers,
            }
            }, {arrayFilters: [ { "n1._id": new ObjectId(teamId) }] })
    } else {
        let removeTeam = await UserModel.updateOne({"teamsCreated._id": new ObjectId(teamId)}, {
            $pull: { teamsCreated : {
                _id: new ObjectId(teamId)
            } } 
        })
        if (removeTeam.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Team update was not successful"
            return response
        }
        teamUpdate = await UserModel.updateOne({_id : new ObjectId(details.newCreatorId)}, {
            $push: { teamsCreated : {
                _id: new ObjectId(teamId),
                teamName: details.teamName,
                sportsTypeId: details.sportsTypeId,
                description: details.description,
                location: details.location,
                division: details.division,
                teamContactEmail: details.teamContactEmail,
                lookingForPlayers: details.lookingForPlayers,
                players: details.players
            } } 
        })
    }
    if (teamUpdate.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

export const adminDeleteTeam = async function(teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team Id is required."
        return response
    }

    let removeTeam = await UserModel.updateOne({"teamsCreated._id": new ObjectId(teamId)}, {
        $pull: { teamsCreated : {
            _id: new ObjectId(teamId)
        } } 
    })
    if (removeTeam.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

const teamValidation = function(details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (!details.teamName || details.teamName === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Team name is required"
        return response
    }
    if (!details.location || details.location === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Location is required"
        return response
    }
    if (!details.teamContactEmail || details.teamContactEmail === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Team contact email is required"
        return response
    }
    if (!details.sportsTypeId || details.sportsTypeId === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Sport is required"
        return response
    }
    response.requestStatus = "ACTC"
    return response
}

export const adminGetMatches = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let leagues = await LeagueModel.find({},{_id :0, leagueName: 1, matches: 1})
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

    let matches = []
    leagues.map(league => {
        league.matches.map(match => {
            matches.push({leagueName: league.leagueName, matchId: match._id, dateOfMatch: match.dateOfMatch, 
                locationOfMatch: match.locationOfMatch, teamId1: match.team1.teamId, teamId2: match.team2.teamId})
        })
    })

    response.requestStatus = "ACTC"
    response.details = matches
    return response
}

export const adminGetLeagues = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let allLeagues = await LeagueModel.find({}, {_id : 1, leagueName: 1, location: 1, division : 1, sportsTypeId: 1})

    if (allLeagues.length === 0) {
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

    let sportIndex, sportsName
    let leagues = []
    allLeagues.map(league => {
        sportIndex = sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
        sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
        leagues.push({leagueId: league._id, leagueName: league.leagueName, location: league.location, division: league.division, sportsName})
    })

    response.requestStatus = "ACTC"
    response.details = leagues
    return response
}

export const adminGetLeagueDetails = async function(leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "League Id is required."
        return response
    }
 
    let league = await LeagueModel.findOne({_id: new ObjectId(leagueId)})
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (league === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    league = {leagueName: league.leagueName, sportsTypeId: league.sportsTypeId, description: league.description, 
            location: league.location, division: league.division, status: league.status, matches: league.matches,
            ageGroup: league.ageGroup, numberOfTeams: league.numberOfTeams, numberOfRounds: league.numberOfRounds, startDate: league.startDate, endDate: league.endDate,
            teams: league.teams, lookingForTeams: league.lookingForTeams, lookingForTeamsChgBy: league.lookingForTeamsChgBy, lookingForTeamsChgTmst: league.lookingForTeamsChgTmst,
            createdBy: league.createdBy, createdAt: league.createdAt, updatedAt: league.updatedAt}
    
    response.requestStatus = "ACTC"
    response.details = league
    return response
}

export const adminCreateLeague = async function(details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!details.newCreatorId || !mongoose.isValidObjectId(details.newCreatorId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "League creator is required."
        return response
    }

    let isValidUser = await getUserFullname(details.newCreatorId, "")
    if (isValidUser === null || isValidUser.playerId === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid league creator"
        return response
    }

    details.status = "NS"
    let valid = leagueValidation(details)
    if (valid.requestStatus !== "ACTC") {
        return valid
    }

    let newLeague = new LeagueModel({
        leagueName: details.leagueName,
        status: "NS",
        location: details.location,
        division: details.division,
        description: details.description,
        sportsTypeId: details.sportsTypeId,
        ageGroup: details.ageGroup,
        numberOfTeams: details.numberOfTeams,
        numberOfRounds: details.numberOfRounds,
        startDate: details.startDate,
        endDate: details.endDate,
        lookingForTeams: false,
        createdBy: new ObjectId(details.newCreatorId)
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
    return response
}

export const adminUpdateLeague = async function(leagueId, details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    
    if (!mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "League Id is required."
        return response
    }

    let leagueCreator = details.createdBy
    if (!details.newCreatorId && details.newCreatorId !== "" && !mongoose.isValidObjectId(details.newCreatorId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid league creator"
        return response
    } else if (mongoose.isValidObjectId(details.newCreatorId.trim())){
        leagueCreator = details.newCreatorId
    }
    
    let isValidUser = await getUserFullname(leagueCreator, "")
    if (isValidUser === null || isValidUser.playerId === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Invalid league creator"
        return response
    }

    let valid = leagueValidation(details)
    if (valid.requestStatus !== "ACTC") {
        return valid
    }

    let league = await LeagueModel.updateOne({ _id: new ObjectId(leagueId)}, { 
        $set: { 
            status: details.status,
            leagueName: details.leagueName,
            location: details.location,
            division: details.division,
            description: details.description,
            sportsTypeId: details.sportsTypeId,
            ageGroup: details.ageGroup,
            numberOfTeams: details.numberOfTeams,
            numberOfRounds: details.numberOfRounds,
            startDate: details.startDate,
            endDate: details.endDate,
            lookingForTeams: details.lookingForTeams,
            lookingForTeamsChgTmst: details.lookingForTeamsChgTmst,
            createdBy: new ObjectId(leagueCreator),
            teams: details.teams
        } 
    })
    if (league.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "League update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

export const adminDeleteLeague = async function(leagueId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(leagueId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "League Id is required."
        return response
    }

    const league = await LeagueModel.deleteOne({ _id : new ObjectId(leagueId) });
    if (league.deletedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "League deletion was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

const leagueValidation = function(details) {

    let response = {requestStatus: "", errField: "", errMsg: ""}
    let ageGroupChars = /[0-9]-[0-9]/

    if (details.leagueName.trim() === "") {
        response.errMsg = 'League name is required.'
        response.errField = "leagueName"
        response.requestStatus = 'RJCT'
        return response
    } 
    if (details.sportsTypeId.trim() === "") {
        response.errMsg = 'Sport is required.'
        response.errField = "sport"
        response.requestStatus = 'RJCT'
        return response
    }
    if (details.location.trim() === "") {
        response.errMsg = 'Location is required.'
        response.errField = "location"
        response.requestStatus = 'RJCT'
        return response
    }
    if (details.startDate === null || details.startDate.trim() === "") {
        response.errMsg = 'Start date is required.'
        response.errField = "startDate"
        response.requestStatus = 'RJCT'
        return response
    }
    let dateChecker = (dateToCheck) => {return (dateToCheck instanceof Date && !isNaN(dateToCheck))}
    if (!dateChecker(new Date(details.startDate))) {
        response.errMsg = 'Start date is invalid.'
        response.errField = "startDate"
        response.requestStatus = 'RJCT'
        return response
    }
    if (details.endDate === null  || details.endDate.trim() === "") {
        response.errMsg = 'End date is required.'
        response.errField = "endDate"
        response.requestStatus = 'RJCT'
        return response
    } 
    if (!dateChecker(new Date(details.endDate))) {
        response.errMsg = 'End date is invalid.'
        response.errField = "endDate"
        response.requestStatus = 'RJCT'
        return response
    }

    if (details.endDate < details.startDate) {
        response.errMsg = 'End date cannot be less than start date.'
        response.errField = "endDate"
        response.requestStatus = 'RJCT'
        return response
    }
    if (details.ageGroup.trim() === "") {
        response.errMsg = 'Age group is required.'
        response.errField = "ageGroup"
        response.requestStatus = 'RJCT'
        return response
    }
    if (!ageGroupChars.test(details.ageGroup.trim())){
        response.errMsg = 'Age group format is invalid.'
        response.errField = "ageGroup"
        response.requestStatus = 'RJCT'
        return response
    }
    if (Number(details.ageGroup.trim().substring(0,details.ageGroup.trim().indexOf("-"))) 
        > Number(details.ageGroup.trim().substring(details.ageGroup.trim().indexOf("-")+1))){
            response.errMsg = 'Age group value is invalid.'
            response.errField = "ageGroup"
            response.requestStatus = 'RJCT'
            return response
    }
    if (details.numberOfTeams < 3 || isNaN(details.numberOfTeams)) {
        response.errMsg = 'Number of teams cannot be less than 3.'
        response.errField = "numberOfTeams"
        response.requestStatus = 'RJCT'
        return response
    }
    if (details.numberOfRounds < 1 || isNaN(details.numberOfRounds)) {
        response.errMsg = 'Number of rounds cannot be less than 1.'
        response.errField = "numberOfRounds"
        response.requestStatus = 'RJCT'
        return response
    }
    if (details.status !== "NS" && details.status !== "ST" && details.status !== "EN") {
        response.errMsg = 'Invalid status'
        response.errField = "status"
        response.requestStatus = 'RJCT'
        return response
    }
    response.requestStatus = 'ACTC'
    return response
}

export const adminGetParms = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let allParms = await systemParameterModel.find()

    if (allParms.length === 0) {
        response.requestStatus = "ACTC"
        response.errMsg = "No data found"
        response.details = []
        return response
    }

    response.requestStatus = "ACTC"
    response.details = allParms
    return response
}

export const adminGetParmDetails = async function(parmId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(parmId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Parameter Id is required."
        return response
    }
 
    let parm = await systemParameterModel.findOne({_id: new ObjectId(parmId)}, { createdBy: 0, createdAt: 0, updatedAt: 0})
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (parm === null) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }
    
    response.requestStatus = "ACTC"
    response.details = parm
    return response
}

export const adminCreateParm = async function(details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let newParm = new systemParameterModel({...details})
    await newParm.save()
    .then(() => {
        response.requestStatus = "ACTC"
        response.parm = newParm
    })
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
    });
    return response
}

export const adminUpdateParm = async function(parmId, details) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    
    if (!mongoose.isValidObjectId(parmId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Parameter Id is required."
        return response
    }

    let parm = await systemParameterModel.updateOne({ _id: new ObjectId(parmId)}, { 
        ...details
    })
    if (parm.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Parameter update was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}

export const adminDeleteParm = async function(parmId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(parmId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Parameter Id is required."
        return response
    }

    const parm = await systemParameterModel.deleteOne({ _id : new ObjectId(parmId) });
    if (parm.deletedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Parameter deletion was not successful"
        return response
    }
    
    response.requestStatus = "ACTC"
    return response
}