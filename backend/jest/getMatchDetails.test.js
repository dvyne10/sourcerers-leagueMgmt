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

function getMatchDetails(matchId) {
 
    let matchObject = {requestStatus: '', errMsg: ''}; 

    if (!matchId || matchId.trim() === '') {
        matchObject.requestStatus = 'RJCT'; 
        matchObject.errMsg = "Match is invalid.";
    }

    return matchObject; 
}

describe('retrieve match function', () => {
    
    test('should reject if match id is null', () => {
        let result = getMatchDetails(null);
        console.log(result);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    test('should reject if match id is undefined', () => {
        let result = getMatchDetails(undefined);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    test('should reject if match id is empty', () => {
        let result = getMatchDetails('');
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    test('should reject if match id contains only blank spaces', () => {
        let result = getMatchDetails('   '); // Match ID contains three blank spaces
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });


});
  

