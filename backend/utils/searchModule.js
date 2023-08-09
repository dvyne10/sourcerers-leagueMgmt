import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";
import UserModel from "../models/user.model.js";
import { getSportsList } from "./sysParmModule.js";

export const getSearchResults = async function(findText, location, playerFilter, teamFilter, leagueFilter) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    if (findText === "") {
        response.requestStatus = "RJCT"
        response.errMsg = "Search text is required"
        return response
    }

    let resp1, resp2, resp3
    let playerResults = []
    let teamResults = []
    let leagueResults = []
    if ((!playerFilter && !teamFilter && !leagueFilter) || (playerFilter && teamFilter && leagueFilter)) {
        resp1 = searchPlayers(findText, location);
        resp2 = searchTeams(findText, location);
        resp3 = searchLeagues(findText, location);
        [playerResults, teamResults, leagueResults] = await Promise.all([resp1, resp2, resp3]);
    } else {
        if (playerFilter) {
            
            if (teamFilter) {
                resp1 = searchPlayers(findText, location);
                resp2 = searchTeams(findText, location);
                [playerResults, teamResults ] = await Promise.all([resp1, resp2]);
            } else if (leagueFilter) {
                resp1 = searchPlayers(findText, location);
                resp2 = searchLeagues(findText, location);
                [playerResults, leagueResults ] = await Promise.all([resp1, resp2]);
            } else {
                playerResults = await searchPlayers(findText, location);
            }
        } else if (teamFilter) {
            if (leagueFilter) {
                resp1 = searchTeams(findText, location);
                resp2 = searchLeagues(findText, location);
                [teamResults, leagueResults ] = await Promise.all([resp1, resp2]);
            } else {
                teamResults = await searchTeams(findText, location);
            }
        } else if (leagueFilter) {
            leagueResults = await searchLeagues(findText, location);
        }
    }
    
    let searchResults = []
    playerResults.map(player => searchResults.push(player))
    teamResults.map(team => searchResults.push(team))
    leagueResults.map(league => searchResults.push(league))

    response.requestStatus = "ACTC"
    response.details = searchResults
    return response
}

export const searchPlayers = async function(findText, location) {
    
    let players = await UserModel.aggregate([ 
        { 
            $match : { 
                $or: [
                    { firstName: new RegExp(`${findText}`, "i") },
                    { lastName: new RegExp(`${findText}`, "i") },
                    { userName: new RegExp(`${findText}`, "i") },
                    { email: new RegExp(`${findText}`, "i") },
                ], userType: "USER", status: "ACTV"
            } 
        },
        { 
          $addFields: {
                name: {
                  $reduce: {
                      input: [ "$firstName", " ", "$lastName" ],
                      initialValue: "",
                      in: {
                          $concat: [ "$$value", "$$this"]
                      }
                  }
                },
                type: "Player",
                rowId: "$_id", 
                sports: "$sportsOfInterest",
                location: {
                    $concat: [ 
                        {$cond : [
                          { $eq : [ "$city", "N/A" ] },  "" , "$city"
                        ]}, 
                        " ", 
                        {$cond : [
                          { $eq : [ "$province", "N/A" ] },  "" , "$province"
                        ]}, 
                        " ", 
                        {$cond : [
                          { $eq : [ "$country", "N/A" ] },  "" , "$country"
                        ]}, 
                    ]
                },
                status: "ACTV",
                statusDesc: "Active",
                lookingForTeams: "N/A",
                lookingForPlayers: "N/A"
          }, 
      }, { $project: { _id: 0, name: 1, type: 1, rowId: 1, sports: 1, location: 1, status: 1, statusDesc: 1, lookingForTeams: 1, lookingForPlayers: 1 } }
    ])

    if (players.length === 0) {
        return []
    }

    let sports = []
    let sportsParms = await getSportsList()
    if (sportsParms.requestStatus === 'ACTC') {
        sports = sportsParms.data
    }

    let sportIndex, sportsName, sportsDetails
    let playerResults = []
    let promises = players.map((player) => {
        if (location !== "" && player.location.toLowerCase().indexOf(location.toLowerCase()) === -1) {
            return
        }
        sportsDetails = player.sports.map(sport => {
            sportIndex = sports.findIndex((i) => i.sportsId.equals(sport))
            sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
            return {sportsTypeId: sport, sportsName}
        })
        playerResults.push({...player, sports: sportsDetails})
    })
    await Promise.all(promises)  
    return playerResults
}

export const searchTeams = async function(findText, location) {
    
    let teamsCreated = await UserModel.aggregate([ 
        { 
            $match : { 
                $or: [
                    { "teamsCreated.teamName": new RegExp(`${findText}`, "i") },
                    { "teamsCreated.teamContactEmail": new RegExp(`${findText}`, "i") },
                ]
            } 
        }, { 
            $project: {
                teamsCreated: {
                    $filter: {
                        input: "$teamsCreated",
                        as: "team",
                        cond: { $or : [
                            {
                                $regexMatch: {
                                    input: "$$team.teamName",
                                    regex: new RegExp(`${findText}`, "i")
                                  }
                            }, {
                                $regexMatch: {
                                    input: "$$team.teamContactEmail",
                                    regex: new RegExp(`${findText}`, "i")
                                  }
                            }
                        ]}
                    }
                }
            }
        }, {
            $project: {
                teams: {
                    $map: {
                        input: "$teamsCreated",
                        as: "team",
                        in: {
                            name: "$$team.teamName",
                            type: "Team",
                            rowId: "$$team._id",
                            sports: ["$$team.sportsTypeId"],
                            location: "$$team.location",
                            status: "ACTV",
                            statusDesc: "Active",
                            lookingForTeams: "N/A",
                            lookingForPlayers: "$$team.lookingForPlayers",
                        }
                    }
                }
            }
        }
    ])

    if (teamsCreated.length === 0) {
        return []
    }

    let sports = []
    let sportsParms = await getSportsList()
    if (sportsParms.requestStatus === 'ACTC') {
        sports = sportsParms.data
    }

    let sportIndex, sportsName
    let teamResults = []
    let promises = teamsCreated.map((teamCreated) => {
        teamCreated.teams.map((team) => {
            if (location !== "" && team.location.toLowerCase().indexOf(location.toLowerCase()) === -1) {
                return
            }
            sportIndex = sports.findIndex((i) => i.sportsId.equals(team.sports[0]))
            sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
            teamResults.push({...team, sports: [{sportsTypeId: team.sports[0], sportsName}]})
        })
    })
    await Promise.all(promises)  
    return teamResults
}

export const searchLeagues = async function(findText, location) {
    
    let leagues = await LeagueModel.aggregate([ 
        { 
            $match : { 
                leagueName: new RegExp(`${findText}`, "i")
            } 
        },
        { 
          $addFields: {
                name: "$leagueName",
                type: "League",
                rowId: "$_id", 
                sports: ["$sportsTypeId"],
                location: "$location",
                status: "$status",
                statusDesc: 
                {
                    $switch:
                      {
                        branches: [
                          {
                            case: { $eq : [ "$status", "NS" ] },
                            then: "Open"
                          },
                          {
                            case: { $eq : [ "$status", "ST" ] },
                            then: "Ongoing"
                          },
                        ],
                        default: "Finished"
                      }
                   },
                lookingForTeams: "$lookingForTeams",
                lookingForPlayers: "N/A"
          }, 
      }, { $project: { _id: 0, name: 1, type: 1, rowId: 1, sports: 1, location: 1, status: 1, statusDesc: 1, lookingForTeams: 1, lookingForPlayers: 1 } }
    ])

    if (leagues.length === 0) {
        return []
    }

    let sports = []
    let sportsParms = await getSportsList()
    if (sportsParms.requestStatus === 'ACTC') {
        sports = sportsParms.data
    }

    let sportIndex, sportsName, sportsDetails
    let leagueResults = []
    let promises = leagues.map((league) => {
        if (location !== "" && league.location.toLowerCase().indexOf(location.toLowerCase()) === -1) {
            return
        }
        sportIndex = sports.findIndex((i) => i.sportsId.equals(league.sports[0]))
        sportsName = sportIndex === -1 ? "" : sports[sportIndex].sportsName
        leagueResults.push({...league, sports: [{sportsTypeId: league.sports[0], sportsName}]})
    })
    await Promise.all(promises)  
    return leagueResults
}