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

    let matchDetails = leagueMatch[0].matches[0]
    matchDetails = {...matchDetails, leagueId: leagueMatch[0].leagueId, leagueStatus: leagueMatch[0].leagueStatus, sportsTypeId: leagueMatch[0].sportsTypeId }
    let index
    let sportDetails = await getPosnAndStatBySport(matchDetails.sportsTypeId.toString())
    let promises1, promises2, promises3, promises4, playerStat
    if (sportDetails.sport !== null) {
        matchDetails.sportsName = sportDetails.sport.sportsName
        promises1 = matchDetails.team1.players.map(async (player) => {
            promises2 = player.statistics.map(async (stat) => {
                index = sportDetails.stats.findIndex(statParm => statParm.statisticsId.equals(stat.statisticsId))
                if (index !== -1) {
                    return {...stat, statShortDesc : sportDetails.stats[index].statShortDesc, statLongDesc : sportDetails.stats[index].statLongDesc}
                }
            })
            playerStat = await Promise.all(promises2);
            return {...player, statistics: playerStat}
        })
        promises3 = matchDetails.team2.players.map(async (player) => {
            promises4 = player.statistics.map(async (stat) => {
                index = sportDetails.stats.findIndex(statParm => statParm.statisticsId.equals(stat.statisticsId))
                if (index !== -1) {
                    return {...stat, statShortDesc : sportDetails.stats[index].statShortDesc, statLongDesc : sportDetails.stats[index].statLongDesc}
                }
            })
            playerStat = await Promise.all(promises4);
            return {...player, statistics: playerStat}
        })
        const [players1, players2] = await Promise.all([promises1, promises3]);
        console.log(80 + JSON.stringify(players2))
        //matchDetails.team1.players = players1
        //matchDetails.team2.players = players2
    }
    
    response.requestStatus = "ACTC"
    response.details = matchDetails
    return response
}