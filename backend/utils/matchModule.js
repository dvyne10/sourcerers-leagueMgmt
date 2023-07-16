import mongoose from "mongoose";
import LeagueModel from "../models/league.model.js";

let ObjectId = mongoose.Types.ObjectId;

export const getMatch = async function(leagueId) {

  try {
    let league = await LeagueModel.findOne({ _id : new ObjectId(leagueId) });
   
    if (!league) {
      console.log("No league found");
      return {
        requestStatus: "RJCT",
        errMsg: "No league found",
      };
    }

    if (league.matches && league.matches.length > 0) {
      console.log("Match found:", league.matches[0]);
      return {
        requestStatus: "ACTC",
        data: league.matches[0],
      };
    } else {
      console.log("No matches found for the league");
      return {
        requestStatus: "RJCT",
        errMsg: "No matches found for the league",
      };
    }
  } catch (error) {
    console.log("Error occurred:", error);
    return {
      requestStatus: "RJCT",
      errMsg: "Error occurred during the request",
    };
  }
};

export const updateMatch = async function(matchId, data) {
  let response = {requestStatus: "", errField: "", errMsg: ""}
  let userId = new ObjectId("648e0a6ff1915e7c19e230359")   // temp

  data.matchId = matchId; 
 
  await MatchModel.updateOne({_id: new ObjectId(matchId)}, {
    $set: {
        dateOfMatch: data.dateOfMatch, 
        locationOfMatch: data.locationOfMatch, 
        'team1.finalScore': data.finalScore1, 
        'team2.finalScore': data.finalScore2, 
        'team1.leaguePoints': data.leaguePoints1, 
        'team2.leaguePoints': data.leaguePoints2, 
        'team1.pendingScore': data.finalScorePending1,
        'team2.pendingScore': data.finalScorePending2,
        'team1.pendingLeaguePoints': data.leaguePointsPending1,
        'team2.pendingLeaguePoints': data.leaguePointsPending2
    }
    })
    .then(function () {
        response.requestStatus = "ACTC";
    })
    .catch(function (error){
      console.log("error occur")
        response.requestStatus = "RJCT";
        response.errMsg = error;
    });
  
  return response; 
}


export const matchValidation = (data, requestType, userId) => {
    let response = {requestStatus: "", errField: "", errMsg: ""};
    let canCreate = true; //temp :should be init to false
    
    if (requestType === "CHG" && !canCreate) {
        response.errMsg = 'Cannot update match details while previous update is still pending for approval'; 
    }
}