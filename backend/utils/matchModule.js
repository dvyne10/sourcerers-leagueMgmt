import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import SysParmModel from "../models/systemParameter.model.js";
import {  } from "./teamsModule.js";
import { hasPendingRequest } from "./requestsModule.js";
import { getPosnAndStatBySport } from "./sysParmModule.js";

let ObjectId = mongoose.Types.ObjectId;

export const getMatchDetails = async function(userId, matchId) {
    let response = {requestStatus: "", errField: "", errMsg: ""}

    if (!mongoose.isValidObjectId(matchId.trim())) {
        response.requestStatus = "RJCT"
        response.errMsg = "Match id required"
        return response
    }
    
    let leagueMatch = await LeagueModel.aggregate([
        { 
            $match: { "matches._id" : new ObjectId(matchId) } 
        }, 
        { 
            $project: {
                matches: {
                    $filter: {
                        input: "$matches",
                        as: "match",
                        cond: { 
                            $eq: [ "$$match._id", new ObjectId(matchId) ],
                        }
                    }
                }, leagueId: "$_id", _id : 0, leagueStatus : "$status", sportsTypeId : 1
            }
        }
    ]).limit(1)
    .catch((error) => {
        response.requestStatus = "RJCT"
        response.errMsg = error
        return response
    })

    if (leagueMatch.length === 0) {
        response.requestStatus = "ACTC"
        response.errMsg = "No data found"
        response.details = {}
        return response
    }

    let sportDetails = getPosnAndStatBySport(leagueMatch.sportsTypeId.toString())
    // let sports = []
    // let sportsParms = await getSportsList()
    // if (sportsParms.requestStatus === 'ACTC') {
    //     sports = sportsParms.data
    // }

    // let teams
    // let fullName
    // let sportsName
    // let sportIndex = 0
    // const promises = leagues.map(async function(league) {
    //     teams = getManyTeamNames(league.teams)
    //     fullName = UserModel.findOne({ _id: new ObjectId(league.createdBy)}, { _id :0, firstName : 1, lastName :  1 })
    //             .then((creator) => {
    //                 if (creator !== null) {
    //                     return `${creator.firstName} ${creator.lastName}`
    //                 } else {
    //                     return ""
    //                 }
    //             });
    //     sportIndex = sports.findIndex((i) => i.sportsId.equals(league.sportsTypeId))
    //     sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
    //     const [teamNames, leagueCreator, leagueSportName] = await Promise.all([teams, fullName, sportsName])
    //     return { ...league, teams : teamNames, createdByName: leagueCreator, sportsName: leagueSportName };
    // })
    
    // const leaguesWithdetails = await Promise.all(promises);
    response.requestStatus = "ACTC"
    response.details = leagueMatch
    return response
}