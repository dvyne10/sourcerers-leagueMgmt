export const getTeamDetails = async function(teamId, teamCollection) {
    let respn = {requestStatus: '', errMsg: ''}; 

    if (!teamId || teamId.trim() === '' || teamId===undefined) {
        respn.requestStatus = 'RJCT'; 
        respn.errMsg = "Team is invalid.";
    } else {
        let team = teamCollection.find(
            (team) => 
                team.teamId === teamId
        );

        if (!team) {
            respn.requestStatus = 'RJCT';
            respn.errMsg = "Team is not found.";
        } else {
            respn.requestStatus = 'ACTC'
        }
    }

    return respn; 
}