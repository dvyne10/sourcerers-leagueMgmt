import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import { getManyTeamNames, getOpenTeams } from "./teamsModule.js";
import { getOpenLeagues } from "./leaguesModule.js";

export const getHomeDetails = async function() {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let resp1 = getTop10Leagues();
    let resp2 = getAdminAnnouncements();
    let resp3 = getTeamOrLeagueAnnouncements();

    const [top10Leagues, adminActiveAnnouncements, teamLeagueAnnouncements] = await Promise.all([resp1, resp2, resp3]);
    if (top10Leagues !== null && adminActiveAnnouncements !== null && teamLeagueAnnouncements !== null) {
        response.requestStatus = "ACTC"
        response.details = { topLeagues: top10Leagues, adminAnnouncements: adminActiveAnnouncements, announcements: teamLeagueAnnouncements}
    } else {
        response.requestStatus = "RJCT",
        response.errMsg = "Error encountered."
    }
    return response
}

export const getTop10Leagues = async function(){
    
    let leagues = await LeagueModel.aggregate([ { $match: { status : "ST" } }, 
        { 
            $project: {
                totalPoints: {
                    $reduce: {
                        input: "$matches",
                        initialValue: 0,
                        in: {
                            $add: [ "$$value", "$$this.team1.leaguePoints", "$$this.team2.leaguePoints"]
                        }
                    }
                }, leagueId: "$_id", _id: 0, leagueName : 1, "teams.teamId" : 1
            }
        }, {
            $sort: { totalPoints : -1}
        }, { 
            $project: {
                totalPoints: 0
            }
        }
    ]).limit(10);

    const promises = leagues.map((league) => {
        return getManyTeamNames(league.teams).then((teams) => {
          return { ...league, teams };
        });
      });
    
    const leaguesWithTeamNames = await Promise.all(promises);
    return leaguesWithTeamNames

}

export const getAdminAnnouncements = async function() {

    let announcements = await UserModel.aggregate([ { $match: { userType: "ADMIN", "announcementsCreated.showInHome"  : true } }, 
        { 
            $project: {
                show: {
                    $filter: {
                        input: "$announcementsCreated",
                        as: "item",
                        cond: { $eq: [ "$$item.showInHome", true ]  }
                    }
                }, _id: 0, userName: 1
            }
        }
    ])

    if (announcements.length > 0) {
        let newList = []
        for (let i=0; i < announcements.length; i++) {
            for (let j=0; j < announcements[i].show.length; j++) {
                newList.push(announcements[i].show[j].announcementMsg)
            }
        }
        announcements = newList
    }

    return announcements
}

export const getTeamOrLeagueAnnouncements = async function() {
    let resp1 = getOpenTeams();
    let resp2 = getOpenLeagues();
    let teamOrLeagueAnnouncements = []
    const [openTeams, openLeagues] = await Promise.all([resp1, resp2]);
    if (openTeams !== null && openLeagues !== null) {
        teamOrLeagueAnnouncements = openTeams.concat(openLeagues)
        teamOrLeagueAnnouncements.sort((a,b) => a.indicatorChgTmst - b.indicatorChgTmst).reverse()
    }
    return teamOrLeagueAnnouncements
}