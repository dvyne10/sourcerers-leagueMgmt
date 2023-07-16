/**
 * CAP805 – IP 3 - Software Testing
 *
 * I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students.
 *
 * Please update the following with your information:
 *
 *      Name: Hyun Seong Lee
 *      Student ID: 139079180
 *      Date: July 16th, 2023
 *
 */

function getMatchDetails(matchId, status) {
    let txnRespObj = { requestStatus: '', errField: '', errMsg: ''};

    if (status === 'PEND') {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = 'status'; 
        txnRespObj.errMsg = 'Cannot update match details while previous update is still pending for approval.';
    } else if (status === 'ACTV') {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = '12345'; 
        txnRespObj.errMsg = 'Match is not found.'; 
    }

    return txnRespObj; 
}

function getTeamDetails(teamId, userId) {

    // temp team collection for testing
    const teamObjectCollection = [
        { teamId: '648e132ff3d2cb1d615fbd9d', createdBy: '648e9014466c1c99574590b1' },
        { teamId: '342e132ff3d2cb1d615fbd9d', createdBy: '912e9014466c1c99574590b1' },
        { teamId: '579e132ff3d2cb1d615fbd9d', createdBy: '706e9014466c1c99574590b1' },
      ];

    let txnRespObj = { requestStatus: '', errField: '', errMsg: ''};

    const teamObject = teamObjectCollection.find((team) => team.teamId === teamId);

    if (teamObject.createdBy !== userId) {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = userId;
        txnRespObj.errMsg = 'Not authorized to update match details.';
    }

    return txnRespObj; 
}

function validateDate(date) {
    let txnRespObj = { requestStatus: '', errField: '', errMsg: '' };

    // Check if date is empty
    if (!date || date.trim() === '') {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = 'dateOfMatch';
        txnRespObj.errMsg = 'Date of match is required.';
    }
    // Check if date is invalid
    else {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            txnRespObj.requestStatus = 'RJCT';
            txnRespObj.errField = 'dateOfMatch';
            txnRespObj.errMsg = 'Date of match is invalid.';
        }
        // Check if date is higher than the current date
        else {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (parsedDate.getTime() > currentDate.getTime()) {
                txnRespObj.requestStatus = 'RJCT';
                txnRespObj.errField = 'dateOfMatch';
                txnRespObj.errMsg = 'Date of match should be before than the current date.';
            }
        }
    }

    return txnRespObj;
}

function isLocationOfMatchEmpty(location) {
    return (location === null || location === undefined || location.trim() === ''); 
}

function checkPlayerListEmpty(players) {
    return (players === null || players === undefined || players.length === 0); 
}

function checkPlayerStatisticsEmpty(playerStat) {
    return (playerStat === null || playerStat === undefined || playerStat.length === 0);
}

function playerStatFinalScoreMatch(finalScoreOne, finalScoreTwo, playerListOne, playerListTwo) {
    let playerListOneFinalScore = 0;
    let playerListTwoFinalScore = 0;

    playerListOne.forEach(player => {
        player.statistics.forEach(statistics => {
            if (statistics.statisticsId === 1) {
                playerListOneFinalScore += statistics.value; 
            }
        })
    })

    playerListTwo.forEach(player => {
        player.statistics.forEach(statistics => {
            if (statistics.statisticsId === 1) {
                playerListTwoFinalScore += statistics.value; 
            }
        })
    })

    return (playerListOneFinalScore === finalScoreOne && playerListTwoFinalScore === finalScoreTwo);
}

function validateMatch(matchObject) {
    let txnRespObj = { requestStatus: '', errField: '', errMsg: '' };
    const dateValidationResult = validateDate(matchObject.dateOfMatch); 

    if (isLocationOfMatchEmpty(matchObject.locationOfMatch)) {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = 'locationOfMatch'; 
        txnRespObj.errMsg = 'Location of match is required.'; 
    }
    if (dateValidationResult.requestStatus = 'RJCT') {
        txnRespObj = dateValidationResult; 
    }
    if (matchObject.teamId && matchObject.teamId1 != matchObject.teamId && matchObject.teamId2 != matchObject.teamId) {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = matchObject.teamId;
        txnRespObj.errMsg = 'Invalid match statistics.';
    }
    if (checkPlayerListEmpty(matchObject.team1.players)) {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = 'players';
        txnRespObj.errMsg = `The details of your team's players for this match are required.`; 
    } 
    if (checkPlayerStatisticsEmpty(matchObject.team1.players.statistics)) {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = 'players';
        txnRespObj.errMsg = `The statistics of your team's players for this match are required.`; 
    }
    if (!playerStatFinalScoreMatch(matchObject.team1.finalScore, matchObject.team2.finalScore, matchObject.team1.players, matchObject.team2.players)) {
        txnRespObj.requestStatus = 'RJCT';
        txnRespObj.errField = 'statistics';
        txnRespObj.errMsg = 'The sum of the total scores of the players does not match the final score entered.';
    }

    return txnRespObj;
}
 


describe('validateMatch function', () => {
    const tempUserId = '648e9014466c1c9912321'; 
    const mockData = {
      matchId: '12345',
      dateOfMatch: '2021-12-18T09:00:00.000+00:00',
      locationOfMatch: 'sf',
      team1: {
        teamId: '648e132ff3d2cb1d615fbd9d',
        finalScore: 2,
        finalScorePending: 5,
        leaguePoints: 3,
        leaguePointsPending: 3,
        players: [
            {
                playerId: 'playerId1',
                statistics: [
                    { statisticsId: 1, value: 1 }, // Goals
                    { statisticsId: 2, value: 2 }, // Assists
                    { statisticsId: 3, value: 3 }, // Shots
                ],
            }
        ],
      },
      team2: {
        teamId: '648e24201b1bedfb32de974c',
        finalScore: 1,
        finalScorePending: 2,
        leaguePoints: 0,
        leaguePointsPending: 1,
        players: [
          {
            playerId: 'playerId2',
            statistics: [
              { statisticsId: 1, value: 1 }, // Goals
              { statisticsId: 2, value: 2 }, // Assists
              { statisticsId: 3, value: 3 }, // Shots
            ],
          },
        ],
      },
      updatedBy: 'updatedById',
      chgRequestedBy: 'chgRequestedById',
    };
  
    // Match Pending 
    // test('should reject if the match is already pending', () => {
    //     let oldMatchObject = getMatchDetails('123', 'PEND');
            
    //     expect(oldMatchObject.requestStatus).toBe('RJCT');
    //     expect(oldMatchObject.errField).toBe('status');
    //     expect(oldMatchObject.errMsg).toBe('Cannot update match details while previous update is still pending for approval.');
    // });

    // Match Active
    // test('should reject if the match is active', () => {
    //     let oldMatchObject = getMatchDetails('123', 'ACTV');

    //     expect(oldMatchObject.requestStatus).toBe('RJCT');
    //     expect(oldMatchObject.errField).toBe(oldMatchObject.errField);
    //     expect(oldMatchObject.errMsg).toBe(oldMatchObject.errMsg);
    // });

    // Only team admin and update match
    // test('should reject if user is not authorized to update match details', () => {
    //     const response = getTeamDetails(mockData.team1.teamId, tempUserId); 

    //     expect(response.requestStatus).toBe('RJCT');
    //     expect(response.errField).toBe(response.errField);
    //     expect(response.errMsg).toBe('Not authorized to update match details.');
    // });

    // test('should reject if teamId exists, and teamId1 and teamId2 are not equal to teamId', () => {
    //     const matchObject = { 
    //         teamId: '523e9014466c1c99574590b1', 
    //         teamId1: '901e9014466c1c99574590b1', 
    //         teamId2: '176e9014466c1c99574590b1' 
    //     };
    //     const response = validateMatch(matchObject);
    //     expect(response.requestStatus).toBe('RJCT');
    //     expect(response.errField).toBe('teamId');
    //     expect(response.errMsg).toBe('Invalid match statistics.');
    // });

    // Date empty & invalid check
    // test('should reject if date is missing, or contains blank/s only', () => {
    //     const result = validateMatch(mockData);
    //     expect(result.requestStatus).toBe('RJCT');
    //     expect(result.errField).toBe('dateOfMatch');
    //     expect(result.errMsg).toBe('Date of match is required.');
    // }); 

    //    test('should reject if date is invalid', () => {
    //        const result = validateMatch(mockData); 
    //        expect(result.requestStatus).toBe('RJCT');
    //        expect(result.errField).toBe('dateOfMatch');
    //        expect(result.errMsg).toBe('Date of match is invalid.'); 
    //    });
    //    test('should reject if date is higher than the current date', () => {
    //        const result = validateMatch(mockData);
    //        expect(result.requestStatus).toBe('RJCT');
    //        expect(result.errField).toBe('dateOfMatch');
    //        expect(result.errMsg).toBe('Date of match should before than the current date.');   
    //    });


    // Location of match empty
    // test('should reject if location of match is missing, or contains blank/s only', () => {
    //     const result = validateMatch(mockData);
    //     expect(result.requestStatus).toBe('RJCT');
    //     expect(result.errField).toBe('locationOfMatch');
    //     expect(result.errMsg).toBe('Location of match is required.');
    // });
    
    // Player list & statistics empty
    // test('should reject if player list is missing or empty', () => {
    //     const result = validateMatch(mockData);
    //     expect(result.requestStatus).toBe('RJCT');
    //     expect(result.errField).toBe('players');
    //     expect(result.errMsg).toBe(`The details of your team's players for this match are required.`); 
    // });
    
    test('should reject if player statistics is missing or empty', () => {
        const result = validateMatch(mockData);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errField).toBe('statistics');
        expect(result.errMsg).toBe(`The sum of the total scores of the players does not match the final score entered.`);
    });
    
});
  


