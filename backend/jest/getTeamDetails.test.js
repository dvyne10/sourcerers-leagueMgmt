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
 const { getTeamDetails } = require('../utils/teamDetailsModule.js');

test('Should be rejected if the TeamId is null', async function ()  {
    result = await getTeamDetails(null);
    console.log(result);
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('Team is invalid.');
});

test('Should be rejected if the TeamId is undefined', async function ()  {
    result = await getTeamDetails(undefined);
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('Team is invalid.');
});

test('Should be rejected if the TeamId is empty', async function ()  {
    result = await getTeamDetails('');
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('Team is invalid.');
});

test('Should be rejected if the TeamId is only whitespaces', async function () {
    result = await getTeamDetails('   ');
    expect(result.requestStatus).toBe('RJCT');
    expect(result.errMsg).toBe('Team is invalid.');
});

test('Should be accepted if the TeamId is valid', async function ()  {
    result = await getTeamDetails('648ba154251b78d7946df340',teamCollection);
    expect(result.requestStatus).toBe('ACTC');
});

test('Should be accepted if the TeamId is valid', async function ()  { //different team, same test.
    result = await getTeamDetails('648ba154251b78d7946df344',teamCollection);
    expect(result.requestStatus).toBe('ACTC');
});

test('Should prompt not found if the TeamId is not found', async function ()  {
    result = await getTeamDetails('648badfa15', teamCollection);
    expect(result.requestStatus).toBe('RJCT');
});



test('Should prompt not found if the TeamId is not found', async function ()  {
    result = await getTeamDetails('648ba154251b78d7946df340aaaa', teamCollection);
    expect(result.requestStatus).toBe('RJCT');
    
});


let teamCollection = [{
    teamId : '648ba154251b78d7946df340',
    teamName : "Gryffindor",
    location : "Hogsmeade Ave., Toronto, ON",
    division : "boys",
    teamContactEmail : "gryffindor@gmail.com",
    description : "The brave ones",
    sportsTypeId : '648ba153251b78d7946df322',
    lookingForPlayers : false,
    lookingForPlayersChgTmst : '2023-06-15T23:40:04.371+00:00',
    createdAt : '2023-06-15T23:40:04.372+00:00',
    updatedAt : '2023-06-15T23:40:04.875+00:00',
},
{
    teamId: '648ba154251b78d7946df344', 
    teamName: "Ravenclaw",
    location: "Hogsmeade Ave., Toronto, ON",
    division: "boys",
    teamContactEmail: "ravenclaw@gmail.com",
    description: "The wise ones",
    sportsTypeId: '648ba153251b78d7946df322',
    lookingForPlayers: false,
    lookingForPlayersChgTmst: '2023-06-15T23:40:04.435+00:00',

    createdAt: '2023-06-15T23:40:04.435+00:00',
    updatedAt: '2023-06-15T23:40:04.435+00:00'}
]

