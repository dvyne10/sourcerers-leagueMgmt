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

function validateMatch(matchId, statusToRetrieve, matchCollection) {
    let matchObject = {requestStatus: '', errMsg: ''}; 

    if (!matchId || matchId.trim() === '') {
        matchObject.requestStatus = 'RJCT'; 
        matchObject.errMsg = "Match is invalid.";
    } else if (statusToRetrieve !== 'ACTV' && statusToRetrieve !== 'PEND') {
        matchObject.requestStatus = 'RJCT';
        matchObject.errMsg = "Match status to retrieve is invalid."; 
    } else {
        let match = matchCollection.find(
            (match) => 
                match.matchId === matchId && match.status === statusToRetrieve
        );

        if (!match) {
            matchObject.requestStatus = 'RJCT';
            matchObject.errMsg = "Match is not found.";
        } else {
            matchObject.requestStatus = 'ACTC'
        }
    }

    return matchObject; 
}

describe('retrieve match function', () => {
    matchId = '12345' // temp 
    // Mock Matches Collection 
    let matchesCollection = [
        {
        matchId: '123',
        status: 'ACTV',
        dateOfMatch: '2023-06-18T09:00:00.000+00:00',
        locationOfMatch: 'Cheery Beach Sports Fields',
        },
        {
        matchId: '',
        status: 'PEND',
        dateOfMatch: '2023-07-18T09:00:00.000+00:00',
        locationOfMatch: 'Sunny Beach Sports Fields',
        },

    ];
    // matchId empty or contains blank/s only 
    test('should reject if match id is null', () => {
        let result = validateMatch(null);
        console.log(result);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    test('should reject if match id is undefined', () => {
        let result = validateMatch(undefined);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    test('should reject if match id is empty', () => {
        let result = validateMatch('');
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    test('should reject if match id contains only blank spaces', () => {
        let result = validateMatch('   '); // Match ID contains three blank spaces
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is invalid.');
    });

    // statusToRetrieve != 'ACTV' and != 'PEND'
    test('should reject if statusToRetrieve is not equal to ACTV or PEND ', () => {
        let result = validateMatch(matchId, 'ACTC'); 
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match status to retrieve is invalid.')
    });

    test('should reject if statusToRetrieve is null', () => {
        let result = validateMatch(matchId, null);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match status to retrieve is invalid.');
    });
    
    test('should reject if statusToRetrieve is undefined', () => {
        let result = validateMatch(matchId, undefined);
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match status to retrieve is invalid.');
    });
    
    test('should reject if statusToRetrieve is an empty string', () => {
        let result = validateMatch(matchId, '');
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match status to retrieve is invalid.');
    });

    // matchId + statusToRetrieve is not found in matches collection
    test('should reject if matchId, statusToRetrieve is not found in matches collection', () => {
        let result = validateMatch('1236', 'ACTV', matchesCollection); 
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Match is not found.');
    });

    // matchId + statusToRetrieve found in matches collection
    test('found item from the match collection', () => {
        let result = validateMatch('123', 'ACTV', matchesCollection); 
        expect(result.requestStatus).toBe('ACTC'); 
    }); 
});
  

