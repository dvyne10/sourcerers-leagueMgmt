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


const { getMatchDetails } = require('./getMatchDetails.test');


function validateMatch(matchId, data) {
    let txnRespObj = { requestStatus: '', errField: '', errMsg: '' };
    
    // Embed getMatchDetails logic inside validateMatch function
    let oldMatchObject = {
        requestStatus: 'RJCT', 
        matchId: matchId,
    };
    
    if (data.status === 'PEND') {
        oldMatchObject.requestStatus = 'ACTC';
    } else if (data.status === 'ACTV') {
        oldMatchObject.requestStatus = 'RJCT';
    }

    if (oldMatchObject.requestStatus === 'ACTC') {
      txnRespObj.requestStatus = 'RJCT';
      txnRespObj.errField = 'status';
      txnRespObj.errMsg = 'Cannot update match details while previous update is still pending for approval.';
    } 

    else if (oldMatchObject.requestStatus === 'RJCT') {
      txnRespObj.requestStatus = 'ACTC'; 
    }
  
    return txnRespObj;
}

  

  describe('validateMatch function', () => {
    const mockMatchId = '648e9014466c1c99574590b1';
    const mockData = {
      matchId: mockMatchId,
      dateOfMatch: '2023-06-18T09:00:00.000+00:00',
      locationOfMatch: 'Cheery Beach Sports Fields',
      team1: {
        teamId: '648e9014466c1c99574590b1',
        finalScore: 2,
        finalScorePending: 5,
        leaguePoints: 3,
        leaguePointsPending: 3,
        players: [
          {
            playerId: 'playerId1',
            statistics: [
              { statisticsId: 1, value: 2 }, // Goals
              { statisticsId: 2, value: 1 }, // Assists
              { statisticsId: 3, value: 5 }, // Shots
            ],
          },
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
  
    test('should reject if the match is already pending', () => {
      const matchDetails = getMatchDetails(mockMatchId, 'PEND');
  
      const response = validateMatch(mockMatchId, mockData, matchDetails);
  
      expect(response.requestStatus).toBe('RJCT');
      expect(response.errField).toBe('status');
      expect(response.errMsg).toBe('Cannot update match details while previous update is still pending for approval.');
    });

    test('should reject if the match is already active', ()=>{
        const matchDetails = getMatchDetails(mockMatchId, 'ACTV'); 

        const response = validateMatch(mockMatchId, mockData, matchDetails);

        expect(response.requestStatus).toBe('RJCT');
        expect(response.errField).toBe('matchId');
        expect(response.errMsg).toBe(matchDetails.errMsg);
    });
});
  


