/*
 * CAP805 – IP 3 - Software Testing
 * I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students.

 *Name: Baris Berber
 *Student ID: 133731224
 *Date: July 16th, 2023
 */

 let result = "";
 const { getLeagueDetails } = require('../utils/leagueDetailsModule.js');


 describe('Get League function testing', function () {
test('Should be rejected if the LeagueId is null', async function ()  {
    result = await getLeagueDetails(null);
    console.log(result);
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('League is invalid.');
});

test('Should be rejected if the LeagueId is undefined', async function ()  {
    result = await getLeagueDetails(undefined);
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('League is invalid.');
});

test('Should be rejected if the LeagueId is empty', async function ()  {
    result = await getLeagueDetails('');
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('League is invalid.');
});

test('Should be rejected if the LeagueId is only whitespaces', async function () {
    result = await getLeagueDetails('   ');
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('League is invalid.');
});

test('Should be accepted if the LeagueId is valid', async function ()  {
    result = await getLeagueDetails('648e9013466c1c995745907c',leagueCollection);
    expect(result.requestStatus).toBe('ACTC');
});

test('Should be accepted if the LeagueId is valid', async function ()  {
    result = await getLeagueDetails('648ba154251b78d7946df35d',leagueCollection);
    expect(result.requestStatus).toBe('ACTC');
});

test('Should prompt not found if the LeagueId is not found', async function ()  {
    result = await getLeagueDetails('648badfa15', leagueCollection);
    expect(result.requestStatus).toBe('RJCT');
});



test('Should prompt not found if the LeagueId is not found', async function ()  {
    result = await getLeagueDetails('648ba154251b78d7946df340aaaa', leagueCollection);
    expect(result.requestStatus).toBe('RJCT');
    
});

test('Should prompt not found if the LeagueId is not found', async function () {
    result = await getLeagueDetails('648ba154251b78d7946df344', leagueCollection);
    expect(result.requestStatus).toBe('RJCT');
    
});

});
let leagueCollection = [{
    
leagueId : '648ba154251b78d7946df35d',
leagueName : "Hogsmeade League 2023",
status : "NS",
location : "Hogsmeade Ave., Toronto, ON",
division : "boys",
description : "Friendly league in Hogsmeade Ave",
sportsTypeId : '648ba153251b78d7946df322',
ageGroup : "9-12",
numberOfTeams : 5,
numberOfRounds : 1,
startDate : '2023-06-16T23:40:04.907+00:00',
endDate : '2023-07-15T23:40:04.907+00:00',
lookingForTeams : false,
lookingForTeamsChgBy : '648ba154251b78d7946df33a',
lookingForTeamsChgTmst : '2023-06-15T23:40:04.907+00:00',
createdBy : '648ba154251b78d7946df33a',
createdAt : '2023-06-15T23:40:04.908+00:00',
updatedAt : '2023-06-15T23:40:04.940+00:00',
},
{
leagueId : '648e9013466c1c995745907c',
leagueName : "York League 2023",
status : "EN",
location : "York, Ontario, CA",
division : "mixed",
description : "A community league aimed to build solidarity.z",
sportsTypeId : '648ba153251b78d7946df311',
ageGroup : "18-25",
numberOfTeams : 15,
numberOfRounds : 2,
startDate : '2023-07-08T00:00:00.000+00:00',
endDate : '2023-07-31T00:00:00.000+00:00',
lookingForTeams : false,
lookingForTeamsChgBy : '648e0a6ff1915e7c19e2303a',
lookingForTeamsChgTmst : '2023-06-15T23:40:04.907+00:00',
createdBy : '648e0a6ff1915e7c19e2303a',
createdAt : '2023-06-18T05:03:15.693+00:00',
updatedAt : '2023-07-16T20:57:30.785+00:00',
},
]

  
