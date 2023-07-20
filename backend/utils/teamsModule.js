import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";

let ObjectId = mongoose.Types.ObjectId;

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
    if (teamId !== null && teamId !== "") {
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
        return team[0].teamsCreated[0].teamName
    } else {
        return teamId
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
    ])

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