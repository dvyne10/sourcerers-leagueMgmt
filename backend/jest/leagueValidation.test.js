// Student Name   : JEMMA MARIE MACAPULAY
// Student Number : 103391223

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { leagueValidation } = require('../utils/leaguesModule.js');

let data = {
    leagueName: "Seneca College Soccer League 2023",
    location: "Toronto, Ontario, CA",
    sportsTypeId: "648ba153251b78d7946df311",
    ageGroup: "18-30",
    numberOfTeams: 12,
    numberOfRounds: 1,
    startDate: "2023-07-17",
    endDate: "2023-07-31",
    leagueId: "64c3dfc45fb6e744a574b730"
}
let userId = "648e529fdf54411c8f837779"
let newData = {}

describe('League Validation - leagueValidation() function', function () {

    beforeAll(async () => {
        dotenv.config();
        await mongoose.connect(process.env.DEV_DB);
    });

    test('leagueValidation should be a function', function () {
      expect(typeof leagueValidation).toBe('function');
    });

    test('Passing a requesType != NEW/CHG/DEL will return RJCT', function () {
      leagueValidation(data, "any", userId)
      .then(result => {
        expect(result.requestStatus).toBe('RJCT');
        expect(result.errMsg).toBe('Request type is invalid.');
        })
    });

    test('User who already has reached the maximum allowed active leagues created will return RJCT', function () {
        leagueValidation(data, "NEW", "648ba154251b78d7946df339")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Maximum allowed number of active leagues created is already reached.');
        })
    });

    test('Request type is CHG but league is not found will return RJCT', async function () {
        newData = {...data, leagueId: "64b44ece24a426f0d78c101a"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League is not found.');
        })
    });

    test('Request type is DEL but league is not found will return RJCT', async function () {
        newData = {...data, leagueId: "64b44ece24a426f0d78c101a"}
        await leagueValidation(newData, "DEL", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League is not found.');
        })
    });

    test('Request type is CHG but user is not an admin of the league will return RJCT', async function () {
        await leagueValidation(data, "CHG", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Not authorized to this page !!!');
        })
    });

    test('Request type is DEL but user is not the creator of the league will return RJCT', async function () {
        newData = {...data, leagueId: "648e9013466c1c995745907c"}
        await leagueValidation(newData, "DEL", "648ba154251b78d7946df337")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Not authorized to delete this league.');
        })
    });

    test('Request type is DEL but league has teams in it will return RJCT', async function () {
        newData = {...data, leagueId: "648e9013466c1c995745907c"}
        await leagueValidation(newData, "DEL", "648e0a6ff1915e7c19e2303a")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League can not be deleted.');
        })
    });

    test('Request type is CHG and sport is changed but league has teams in it will return RJCT', async function () {
        newData = {...data, sportsTypeId: "64b44ece24a426f0d78c101a", leagueId: "64b44ef124a426f0d78c101b"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sports type cannot be amended.');
        })
    });

    test('Request type is NEW but league name is empty will return RJCT', async function () {
        newData = {...data, leagueName: ""}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League name is required.');
        })
    });

    test('Request type is NEW but league name contains blanks only will return RJCT', async function () {
        newData = {...data, leagueName: "  "}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League name is required.');
        })
    });

    test('Request type is CHG but league name is empty will return RJCT', async function () {
        newData = {...data, leagueName: ""}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League name is required.');
        })
    });

    test('Request type is CHG but league name contains blanks only will return RJCT', async function () {
        newData = {...data, leagueName: "  "}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('League name is required.');
        })
    });

    test('Request type is NEW and sport is empty will return RJCT', async function () {
        newData = {...data, sportsTypeId: ""}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sport is required.');
        })
    });

    test('Request type is CHG and sport is empty will return RJCT', async function () {
        newData = {...data, sportsTypeId: ""}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sport is required.');
        })
    });

    test('Request type is NEW and sport contains blanks only will return RJCT', async function () {
        newData = {...data, sportsTypeId: "  "}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sport is required.');
        })
    });

    test('Request type is CHG and sport contains blanks only will return RJCT', async function () {
        newData = {...data, sportsTypeId: "  "}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sport is required.');
        })
    });

    test('Request type is NEW and sport is invalid will return RJCT', async function () {
        newData = {...data, sportsTypeId: "64b44ece24a426f0d78c10bb"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sports type is not valid.');
        })
    });

    test('Request type is CHG and sport is invalid will return RJCT', async function () {
        newData = {...data, sportsTypeId: "64b44ece24a426f0d78c10cc"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Sports type is not valid.');
        })
    });

    test('Request type is NEW but location is empty will return RJCT', async function () {
        newData = {...data, location: ""}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Location is required.');
        })
    });

    test('Request type is NEW but location contains blanks only will return RJCT', async function () {
        newData = {...data, location: "  "}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Location is required.');
        })
    });

    test('Request type is CHG but location is empty will return RJCT', async function () {
        newData = {...data, location: ""}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Location is required.');
        })
    });

    test('Request type is CHG but location contains blanks only will return RJCT', async function () {
        newData = {...data, location: "  "}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Location is required.');
        })
    });

    test('Request type is NEW but start date is empty will return RJCT', async function () {
        newData = {...data, startDate: ""}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is required.');
        })
    });

    test('Request type is NEW but start date contains blanks only will return RJCT', async function () {
        newData = {...data, startDate: "  "}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is required.');
        })
    });

    test('Request type is CHG but start date is empty will return RJCT', async function () {
        newData = {...data, startDate: ""}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is required.');
        })
    });

    test('Request type is CHG but start date contains blanks only will return RJCT', async function () {
        newData = {...data, startDate: "  "}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is required.');
        })
    });

    test('Request type is NEW but start date is invalid will return RJCT', async function () {
        newData = {...data, startDate: "2021-11-00"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is invalid.');
        })
    });

    test('Request type is NEW but start date is invalid will return RJCT', async function () {
        newData = {...data, startDate: "2021-11"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is invalid.');
        })
    });

    test('Request type is CHG but start date is invalid will return RJCT', async function () {
        newData = {...data, startDate: "2021-03-00"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is invalid.');
        })
    });

    test('Request type is CHG but start date is invalid will return RJCT', async function () {
        newData = {...data, startDate: "2021-03-0"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Start date is invalid.');
        })
    });
    
    test('Request type is NEW but end date is empty will return RJCT', async function () {
        newData = {...data, endDate: ""}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is required.');
        })
    });

    test('Request type is NEW but end date contains blanks only will return RJCT', async function () {
        newData = {...data, endDate: "  "}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is required.');
        })
    });

    test('Request type is CHG but end date is empty will return RJCT', async function () {
        newData = {...data, endDate: ""}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is required.');
        })
    });

    test('Request type is CHG but end date contains blanks only will return RJCT', async function () {
        newData = {...data, endDate: "  "}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is required.');
        })
    });

    test('Request type is NEW but end date is invalid will return RJCT', async function () {
        newData = {...data, endDate: "2021-11-00"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is invalid.');
        })
    });

    test('Request type is NEW but end date is invalid will return RJCT', async function () {
        newData = {...data, endDate: "2021-11"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is invalid.');
        })
    });

    test('Request type is CHG but end date is invalid will return RJCT', async function () {
        newData = {...data, endDate: "2021-03-00"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is invalid.');
        })
    });

    test('Request type is CHG but end date is invalid will return RJCT', async function () {
        newData = {...data, endDate: "2021-03-0"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date is invalid.');
        })
    });

    test('Request type is NEW but end date is earlier than start date will return RJCT', async function () {
        newData = {...data, startDate: "2023-07-15", endDate: "2023-07-14"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date cannot be less than start date.');
        })
    });

    test('Request type is CHG but end date is earlier than start date will return RJCT', async function () {
        newData = {...data, startDate: "2023-07-20", endDate: "2023-07-13"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('End date cannot be less than start date.');
        })
    });

    test('Request type is NEW but age group is empty will return RJCT', async function () {
        newData = {...data, ageGroup: ""}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group is required.');
        })
    });

    test('Request type is NEW but age group contains blanks only will return RJCT', async function () {
        newData = {...data, ageGroup: "  "}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group is required.');
        })
    });

    test('Request type is CHG but age group is empty will return RJCT', async function () {
        newData = {...data, ageGroup: ""}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group is required.');
        })
    });

    test('Request type is CHG but age group contains blanks only will return RJCT', async function () {
        newData = {...data, ageGroup: "  "}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group is required.');
        })
    });

    test('Request type is NEW but age group is invalid will return RJCT', async function () {
        newData = {...data, ageGroup: "20"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group format is invalid.');
        })
    });

    test('Request type is NEW but age group is invalid will return RJCT', async function () {
        newData = {...data, ageGroup: "20-"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group format is invalid.');
        })
    });

    test('Request type is CHG but age group is invalid will return RJCT', async function () {
        newData = {...data, ageGroup: "a"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group format is invalid.');
        })
    });

    test('Request type is CHG but age group is invalid will return RJCT', async function () {
        newData = {...data, ageGroup: "-231"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group format is invalid.');
        })
    });

    test('Request type is NEW but age group has higher left hand side will return RJCT', async function () {
        newData = {...data, ageGroup: "12-11"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group value is invalid.');
        })
    });

    test('Request type is CHG but age group has higher left hand side will return RJCT', async function () {
        newData = {...data, ageGroup: "25-18"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Age group value is invalid.');
        })
    });

    test('Request type is NEW but number of teams is not a number will return RJCT', async function () {
        newData = {...data, numberOfTeams: "a"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of teams cannot be less than 3.');
        })
    });

    test('Request type is CHG but number of teams is not a number will return RJCT', async function () {
        newData = {...data, numberOfTeams: "b1"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of teams cannot be less than 3.');
        })
    });

    test('Request type is NEW but number of teams is less than 3 return RJCT', async function () {
        newData = {...data, numberOfTeams: "2"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of teams cannot be less than 3.');
        })
    });

    test('Request type is CHG but number of teams is less than 3 will return RJCT', async function () {
        newData = {...data, numberOfTeams: "-2"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of teams cannot be less than 3.');
        })
    });

    test('Request type is NEW but number of rounds is not a number will return RJCT', async function () {
        newData = {...data, numberOfRounds: "a"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of rounds cannot be less than 1.');
        })
    });

    test('Request type is CHG but number of rounds is not a number will return RJCT', async function () {
        newData = {...data, numberOfRounds: "b1"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of rounds cannot be less than 1.');
        })
    });

    test('Request type is NEW but number of rounds is less than 1 return RJCT', async function () {
        newData = {...data, numberOfRounds: "0"}
        await leagueValidation(newData, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of rounds cannot be less than 1.');
        })
    });

    test('Request type is CHG but number of rounds is less than 1 will return RJCT', async function () {
        newData = {...data, numberOfRounds: "-1"}
        await leagueValidation(newData, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of rounds cannot be less than 1.');
        })
    });

    test('Request type is CHG and numberOfRounds was changed but league status !== "NS" will return RJCT', async function () {
        newData = {...data, leagueId: "648e9013466c1c995745907c", numberOfRounds: 3}
        await leagueValidation(newData, "CHG", "648e0a6ff1915e7c19e2303a")
        .then(result => {
            expect(result.requestStatus).toBe('RJCT');
            expect(result.errMsg).toBe('Number of rounds can no longer be changed.');
        })
    });

    test('Request type is NEW and all mandatory fields are filled up correctly will return ACTC', async function () {
        await leagueValidation(data, "NEW", "648ba154251b78d7946df338")
        .then(result => {
            expect(result.requestStatus).toBe('ACTC');
        })
    });

    test('Request type is CHG and all mandatory fields are filled up correctly will return ACTC', async function () {
        await leagueValidation(data, "CHG", userId)
        .then(result => {
            expect(result.requestStatus).toBe('ACTC');
        })
    });

});

