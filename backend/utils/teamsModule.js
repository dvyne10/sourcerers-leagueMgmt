import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import { getSportName } from "./sysParmModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const getTeamDetails = async function(teamId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (teamId === null || teamId.trim() === "") {
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
    if (userId.trim() === "" || userId === null) {
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
    if (userId.trim() === "" || userId === null) {
        return teamsUserIsMember
    }
    let teams = await UserModel.find({"teamsCreated.players.playerId"  : new ObjectId(userId)}, { _id: 0, teamsCreated : 1})
    if (teams !== null && teams.length > 0) {
        for (let i=0; i < teams.length; i++) {
            for (let j=0; j < teams[i].teamsCreated.length; j++) {
                for (let k=0; k < teams[i].teamsCreated[j].players.length; k++) {
                    if (teams[i].teamsCreated[j].players[k].playerId.equals(new ObjectId(userId))) {
                        await getSportName(teams[i].teamsCreated[j].sportsTypeId)
                        .then(resp => {
                            teamsUserIsMember.push({teamId : teams[i].teamsCreated[j]._id, teamName : teams[i].teamsCreated[j].teamName, 
                                sportsTypeId: teams[i].teamsCreated[j].sportsTypeId, sportsName: resp,
                                jerseyNumber: teams[i].teamsCreated[j].players[k].jerseyNumber
                            })
                        })
                        
                    }
                }
            }
        }
    }
    return teamsUserIsMember
}

export const getManyTeamNames = async function(teams) {
    if (teams.length > 0) {
        const promises = teams.map((team) => {
            return getTeamName(team.teamId).then((teamName) => {
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
    if (teamId !== null && teamId!== "") {
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

export const getTeamAdmin = async function(teamId) {
    if (teamId !== null && teamId!== "") {
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