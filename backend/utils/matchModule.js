import mongoose from "mongoose"; 
import MatchModel from "../models/subSchemas/matches.schema"; 

export const updateMatch = async function(matchId, data) {
    let response = {requestStatus: "", errField: "", errMsg: ""}
    let userId = new ObjectId("648e0a6ff1915e7c19e230359")   // temp

    data.matchId = matchId; 
    let validate = matchValidation(data, "CHG", userId); 

    if (validate.requestStatus !== "") {
        response = validate;  
    } else {
        await MatchModel.updateOne({_id: new ObjectId(matchId)}, {
            $set: {
                dateOfMatch: data.dateOfMatch, 
                locationOfMatch: data.locationOfMatch, 
                'team1.finalScore': data.team1.finalScore, 
                'team2.finalScore': data.team2.finalScore, 
                'team1.leaguePoints': data.team1.leaguePoints, 
                'team2.leaguePoints': data.team2.leaguePoints, 
                'team1.pendingScore': data.team1.pendingScore,
                'team2.pendingScore': data.team2.pendingScore,
            }
        })
        .then(function () {
            response.requestStatus = "ACTC";
        })
        .catch(function (error){
            response.requestStatus = "RJCT";
            response.errMsg = error;

        });
    }
    return response; 
}

export const matchValidation = (data, requestType, userId) => {
    let response = {requestStatus: "", errField: "", errMsg: ""};
    let canCreate = true; //temp :should be init to false
    
    if (requestType === "CHG" && !canCreate) {
        response.errMsg = 'Cannot update match details while previous update is still pending for approval'; 
    }
}