// Student Name   : JEMMA MARIE MACAPULAY
// Student Number : 103391223

const { leagueValidation } = require('../utils/leaguesModule.js');
//import { leagueValidation } from '../utils/leaguesModule'

let data = {
    leagueName: "Seneca College Soccer League 2023",
    location: "Toronto, Ontario, CA",
    sportsTypeId: "648ba153251b78d7946df311",
    ageGroup: "18-30",
    numberOfTeams: 12,
    numberOfRounds: 1,
    startDate: "2023-07-17",
    endDate: "2023-07-31",
}
let userId = "648e0a6ff1915e7c19e2303a"
let result = {}

describe('League Validation - leagueValidation() function', function () {
    
    test('leagueValidation should be a function', function () {
      expect(typeof leagueValidation).toBe('function');
    });

    test('Passing a requesType != NEW/CHG/DEL will return RJCT', async function () {
      result = await leagueValidation(data, "any", userId);
      console.log(result)
      expect(result.requestStatus).toBe('RJCT');
      expect(result.errMsg).toBe('Request type is invalid.');
    });
  
  });
  