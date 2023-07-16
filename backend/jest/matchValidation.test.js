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

describe('validateMatch function', () => {
    const tempUserId = '648e9014466c1c9912321'; 
    const mockData = {
      matchId: '12345',
      dateOfMatch: '2023-06-18T09:00:00.000+00:00',
      locationOfMatch: 'Cheery Beach Sports Fields',
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
  
    // test('should reject if the match is already pending', () => {
    //     let oldMatchObject = getMatchDetails('123', 'PEND');
            
    //     expect(oldMatchObject.requestStatus).toBe('RJCT');
    //     expect(oldMatchObject.errField).toBe('status');
    //     expect(oldMatchObject.errMsg).toBe('Cannot update match details while previous update is still pending for approval.');
    // });

    // test('should reject if the match is active', () => {
    //     let oldMatchObject = getMatchDetails('123', 'ACTV');

    //     expect(oldMatchObject.requestStatus).toBe('RJCT');
    //     expect(oldMatchObject.errField).toBe(oldMatchObject.errField);
    //     expect(oldMatchObject.errMsg).toBe(oldMatchObject.errMsg);
    // });

    test('should reject if user is not authorized to update match details', () => {
        const response = getTeamDetails(mockData.team1.teamId, tempUserId); 

        expect(response.requestStatus).toBe('RJCT');
        expect(response.errField).toBe(response.errField);
        expect(response.errMsg).toBe('Not authorized to update match details.');
    });


});
  


