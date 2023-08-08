import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getSportName, getSportsList, getPosnAndStatBySport } from "./sysParmModule.js";
import { getUserFullname } from "./usersModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const getTeamDetails = async function(teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Teams Id is required."
        return response
    }

    let team = await UserModel.aggregate([ { $match: { "teamsCreated._id"  : new ObjectId(teamId) } }, 
        { 
            $project: {
                teamsCreated: {
                    $filter: {
                        input: "$teamsCreated",
                        as: "team",
                        cond: { $eq: [ "$$team._id", new ObjectId(teamId) ]  }
                    }
                }
            }
        }    
    ]).limit(1)
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (team.length === 0) {
        response.requestStatus = "RJCT"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    let createdBy = team[0]._id
    team = team[0].teamsCreated[0]
    let sportsName = await getSportName(team.sportsTypeId.toString())

    const teamWithdetails = { ...team, sportsName, createdBy };

    response.requestStatus = "ACTC"
    response.details = teamWithdetails
    return response

}

export const getTeamsCreated = async function(userId) {
    let teamsCreated = []
    if (!mongoose.isValidObjectId(userId.trim())) {
        return teamsCreated
    }
    let teams = await UserModel.findOne({ _id: new ObjectId(userId)}, 
        { _id :0, "teamsCreated._id" : 1, "teamsCreated.teamName" : 1, "teamsCreated.sportsTypeId" : 1 })
    if (teams !== null) {
        teams = teams.teamsCreated
        for (let i=0; i < teams.length; i++) {
            teamsCreated.push({teamId : teams[i]._id, teamName : teams[i].teamName, sportsTypeId: teams[i].sportsTypeId})
        }
    }
    return teamsCreated
}

export const getUsersTeams = async function(userId) {
    let teamsUserIsMember = []
    if (!mongoose.isValidObjectId(userId.trim())) {
        return teamsUserIsMember
    }
    let teams = await UserModel.aggregate([ { $match: { "teamsCreated.players.playerId"  : new ObjectId(userId) } },
        { 
            $project: {
                teamsCreated: {
                    $filter: {
                        input: "$teamsCreated",
                        as: "team",
                        cond: { 
                            $anyElementTrue: {
                                $map: {
                                    input: "$$team.players",
                                    in: { $eq : [ "$$this.playerId", new ObjectId(userId) ] }
                                }
                            }
                        }
                    }
                }, _id: 0
            }
        },
        {
            $project: {
                team: {
                    $map: {
                        input: "$teamsCreated",
                        as: "team",
                        in: {
                            teamId: "$$team._id",
                            teamName: "$$team.teamName",
                            sportsTypeId: "$$team.sportsTypeId"
                        }
                    }
                }
            }
        }
    ])

    teams.map(teamCreator => {
        teamCreator.team.map(team => {
            teamsUserIsMember.push(team)
        })
    })
    return teamsUserIsMember
}

export const getManyTeamNames = async function(teams) {
    if (teams.length > 0) {
        const promises = teams.map((team) => {
            return getTeamName(team.teamId.toString()).then((teamName) => {
              return { ...team, teamName: teamName };
            });
          });   
        const teamsWithTeamNames = await Promise.all(promises);
        return teamsWithTeamNames  
    } else {
        return []
    }   
}

export const getTeamName = async function(teamId) {
    if (mongoose.isValidObjectId(teamId.trim())) {
        let team = await UserModel.aggregate([ { $match: { "teamsCreated._id"  : new ObjectId(teamId) } }, 
            { 
                $project: {
                    teamsCreated: {
                        $filter: {
                           input: "$teamsCreated",
                           as: "team",
                           cond: { $eq: [ "$$team._id", new ObjectId(teamId) ]  }
                        }
                    }
                }
            }
        ]).limit(1)
        if (team.length !== 0) {
            return team[0].teamsCreated[0].teamName
        } else {
            return ""
        }
        
    } else {
        return ""
    }   
}

export const isTeamAdmin = async function(userId, teamId) {
    
    if (!mongoose.isValidObjectId(userId.trim()) || !mongoose.isValidObjectId(teamId.trim())) {
        return false
    }
    let team = await UserModel.findOne({ _id: new ObjectId(userId), "teamsCreated._id": new ObjectId(teamId)}, {_id : 1, teamsCreated : 0})
    if (team === null) {
        return false
    } else {
        return true
    }
}

export const getTeamAdmin = async function(teamId) {
    if (mongoose.isValidObjectId(teamId.trim())) {
        let team = await UserModel.aggregate([ { $match: { "teamsCreated._id"  : new ObjectId(teamId) } }, 
            { 
                $project: {
                    teamsCreated: {
                        $filter: {
                           input: "$teamsCreated",
                           as: "team",
                           cond: { $eq: [ "$$team._id", new ObjectId(teamId) ]  }
                        }
                    }
                }
            }
        ]).limit(1)
        if (team.length !== 0) {
            return team[0]._id
        } else {
            return ""
        }
    } else {
        return ""
    }   
}

export const isTeamMember = async function(userId, playerId) {
    if (mongoose.isValidObjectId(userId.trim()) && mongoose.isValidObjectId(playerId.trim())) {
        if (userId === playerId) {
            return true
        }
        let team = await UserModel.findOne({ _id: new ObjectId(userId), "teamsCreated.players.playerId"  : new ObjectId(playerId) }, { _id: 1})
        if (team !== null) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }   
}

export const getOpenTeams = async function() {
    let openTeams = await UserModel.aggregate([ { $match: { "teamsCreated.lookingForPlayers" : true } }, 
        { 
            $project: {
                teams: {
                    $filter: {
                        input: "$teamsCreated",
                        as: "team",
                        cond: { $eq: [ "$$team.lookingForPlayers" , true ]  }
                    }
                }, _id : 0
            }
        },
        { 
            $project: {
                "teams._id" : 1, "teams.teamName" : 1, "teams.lookingForPlayersChgTmst" : 1
            }
        }, {
            $sort: { "teams.lookingForPlayersChgTmst" : -1}
        }
    ]).limit(10)

    if (openTeams.length > 1) {

        let parm = await SysParmModel.findOne({ parameterId: "dfltAnnouncement"}, {dfltAnnouncement : 1}).exec();
        let dfltTeamMsg = parm.dfltAnnouncement.defaultMsgTeamAncmt
        let startPos = dfltTeamMsg.indexOf("&teamName")
        let endPos = dfltTeamMsg.indexOf(" ", startPos)
        let startString = ""
        let endString = ""
        if (startPos > 0) {
            startString = dfltTeamMsg.substring(0,startPos)
        }
        if (endPos > 0 && endPos !== -1) {
            endString = dfltTeamMsg.substring(endPos)
        }
        
        let newList = []
        for (let i=0; i < openTeams.length; i++) {
            for (let j=0; j < openTeams[i].teams.length; j++) {
                if (openTeams[i].teams[j].lookingForPlayersChgTmst !== null && openTeams[i].teams[j].lookingForPlayersChgTmst !== "") {
                    newList.push({teamId : openTeams[i].teams[j]._id, teamName : openTeams[i].teams[j].teamName, 
                        teamMsg: startString + openTeams[i].teams[j].teamName + endString,
                        indicatorChgTmst : openTeams[i].teams[j].lookingForPlayersChgTmst
                    })
                }
            }
        }
        openTeams = newList

    }

    return openTeams
}

export const createTeam = async function(userId, data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let validate = await teamValidation(data, "NEW", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        let newTeam = await UserModel.updateOne({_id : new ObjectId(userId)}, {
            $push: { teamsCreated : {
                teamName: data.teamName,
                sportsTypeId: data.sportsTypeId,
                description: data.description,
                location: data.location,
                division: data.division,
                teamContactEmail: data.teamContactEmail,
                lookingForPlayers: false,
            } } 
        })

        if (!newTeam.modifiedCount || newTeam.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Creation was not successful"
        }

        let newTeamObject = await UserModel.findOne({ _id : new ObjectId(userId) }, { teamsCreated: 1, _id: 0 })
        let index = newTeamObject.teamsCreated.length -1
        response.requestStatus = "ACTC"
        response.team = newTeamObject.teamsCreated[index]
    }
    return response
}

export const getTeamDetailsForUpdate = async function(userId, teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (!mongoose.isValidObjectId(userId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "User Id is required."
        return response
    }
    if (!mongoose.isValidObjectId(teamId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Team Id is required."
        return response
    }
    let isTeamAdminInd =  await isTeamAdmin(userId, teamId)
    if (!isTeamAdminInd) {
        response.requestStatus = 'RJCT'
        response.errMsg = 'Not authorized to this page !!!'
        return response
    }
    let resp1 = getTeamDetails(teamId)
    let resp2 = getSportsList()
    let [teamDetails, sportOptions] = await Promise.all([resp1, resp2])

    if (teamDetails.requestStatus !== "ACTC") {
        response.requestStatus = "RJCT"
        response.errMsg = "Team is not found."
        return response
    } else {
        let detailsForUpdate = teamDetails.details
        let playersForUpdate = []
        let promise1 = detailsForUpdate.players.map(async function(player) { 
            let playerDetails = await getUserFullname(player.playerId.toString(), "")
            playersForUpdate.push({playerId: player.playerId, userName: playerDetails.userName, playerName: playerDetails.fullName, 
                position: player.position, jerseyNumber: player.jerseyNumber, joinedTimestamp: player.joinedTimestamp})
        })
        let promise2 = getPosnAndStatBySport(detailsForUpdate.sportsTypeId.toString())
        let [playersList, sportDetails] = await Promise.all([promise1, promise2])
        
        response.requestStatus = "ACTC"
        response.details = {...detailsForUpdate, players: playersForUpdate, sportOptions: sportOptions.data, positionOptions: sportDetails.positions}
        return response
    }
}

export const updateTeam = async function(userId, teamId, data){
    let response = {requestStatus: "", errField: "", errMsg: ""}

    console.log(JSON.stringify(data.players))
    data.teamId = teamId
    let validate = await teamValidation(data, "CHG", userId)

    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        let teamUpdate = await UserModel.updateOne({ _id : new ObjectId(userId), "teamsCreated._id" : new ObjectId(teamId) }, { 
            $set: { "teamsCreated.$[n1].teamName": data.teamName, 
                    "teamsCreated.$[n1].sportsTypeId": data.sportsTypeId, 
                    "teamsCreated.$[n1].description": data.description,
                    "teamsCreated.$[n1].location": data.location,
                    "teamsCreated.$[n1].division": data.division,
                    "teamsCreated.$[n1].teamContactEmail": data.teamContactEmail,
                    "teamsCreated.$[n1].players": data.players,
            }
            }, {arrayFilters: [ { "n1._id": new ObjectId(teamId) }] })

        if (teamUpdate.modifiedCount !== 1) {
            response.requestStatus = "RJCT"
            response.errMsg = "Team not updated"
            return response
        } else {
            response.requestStatus = "ACTC"
        }
    }
    return response
}

export const deleteTeam = async function(userId, teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let data = {teamId}
    let validate = await teamValidation(data, "DEL", userId)
    console.log(JSON.stringify(validate))
    if (validate.requestStatus !== "ACTC") {
        response = validate
    } else {
        let deteteTeam = await UserModel.updateOne({_id : new ObjectId(userId)}, {
            $pull: { teamsCreated : {
                _id: new ObjectId(teamId)
            } } 
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

export const teamValidation = async function(data, requestType, userId) {

    let response = {requestStatus: "", errField: "", errMsg: ""}
    let oldTeamObject = null
    let sportDetails = null

    if (requestType != "NEW" && requestType != "CHG" && requestType != "DEL") {
        response.errMsg = 'Request type is invalid.'
        response.requestStatus = 'RJCT'
        return response
    } 
    if (requestType !== "NEW") {
        oldTeamObject = await UserModel.findOne({ _id : new ObjectId(userId), "teamsCreated._id" : new ObjectId(data.teamId) }, { 
            "teamsCreated.$": 1, _id: 0
        })
        if (!oldTeamObject) {
            response.errMsg = 'Team is not found.'
            response.requestStatus = 'RJCT'
            return response
        }
        oldTeamObject = oldTeamObject.teamsCreated[0]
    }
    if (requestType === "DEL" && (oldTeamObject.players.length !== 0 ) ) {
        response.errMsg = 'Team cannot be deleted.'
        response.requestStatus = 'RJCT'
        return response
    }
    let teamHasGames = null
    if (requestType !== "NEW") {
        teamHasGames = await LeagueModel.find({ "teams.teamId" : new ObjectId(data.teamId) })
        console.log(JSON.stringify(teamHasGames))
    }
    if (requestType === "DEL" && teamHasGames !== null && teamHasGames.length !== 0) {
        response.errMsg = 'Team with matches cannot be deleted.'
        response.requestStatus = 'RJCT'
        return response
    }
    if (requestType === "CHG" && data.sportsTypeId.trim() != "" && !oldTeamObject.sportsTypeId.equals(new ObjectId(data.sportsTypeId)) && oldTeamObject.players.length !== 0 ) {
        response.errMsg = 'Sports type cannot be amended.'
        response.requestStatus = 'RJCT'
        return response
    }  
    if (requestType != "DEL" && data.teamName.trim() === "") {
        response.errMsg = 'Team name is required.'
        response.errField = "teamName"
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
    if (requestType != "DEL" && data.teamContactEmail.trim() === "") {
        response.errMsg = 'Team contact email is required.'
        response.errField = "teamContactEmail"
        response.requestStatus = 'RJCT'
        return response
    }
    response.requestStatus = 'ACTC'
    return response
}

export const removePlayerFromTeam = async function(userId, teamId, playerId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    let removePlayer = await UserModel.updateOne({_id : new ObjectId(userId), "teamsCreated._id" : new ObjectId(teamId),
            "teamsCreated.players.playerId" : new ObjectId(playerId)}, 
        {
            $pull: { "teamsCreated.$.players" : {
                playerId: new ObjectId(playerId)
            } } 
    })
    if (!removePlayer.modifiedCount || removePlayer.modifiedCount !== 1) {
        response.requestStatus = "RJCT"
        response.errMsg = "Removal was not successful"
        return response
    }

    response.requestStatus = "ACTC"
    return response
}