export const getLeagueDetails = async function(leagueId, leagueCollection) {
    let respn = {requestStatus: '', errMsg: ''}; 

    if (!leagueId || leagueId.trim() === '' || leagueId===undefined) {
        respn.requestStatus = 'RJCT'; 
        respn.errMsg = "League is invalid.";
    } else {
        let league = leagueCollection.find(
            (league) => 
                league.leagueId === leagueId
        );

        if (!league) {
            respn.requestStatus = 'RJCT';
            respn.errMsg = "League is not found.";
        } else {
            respn.requestStatus = 'ACTC'
        }
    }

    return respn; 
}