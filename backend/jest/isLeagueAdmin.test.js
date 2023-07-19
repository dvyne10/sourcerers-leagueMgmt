// Student Name   : JEMMA MARIE MACAPULAY
// Student Number : 103391223

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { isLeagueAdmin } = require('../utils/leaguesModule.js');

describe('Checking if a user is an admin of a league - isLeagueAdmin() function', function () {

    beforeAll(async () => {
        dotenv.config();
        await mongoose.connect(process.env.DEV_DB);
    });

    test('isLeagueAdmin should be a function', function () {
      expect(typeof isLeagueAdmin).toBe('function');
    });

    test('Empty user id will return false', function () {
        isLeagueAdmin("", "648e9013466c1c995745907c")
        .then(result => {
            expect(result).toBe(false);
        })
    });

    test('Blank user id will return false', function () {
        isLeagueAdmin("      ", "648e9013466c1c995745907c")
        .then(result => {
            expect(result).toBe(false);
        })
    });

    test('Empty league id will return false', function () {
        isLeagueAdmin("648e0a6ff1915e7c19e2303a", "")
        .then(result => {
            expect(result).toBe(false);
        })
    });

    test('Blank league id will return false', function () {
        isLeagueAdmin("648e0a6ff1915e7c19e2303a", "  ")
        .then(result => {
            expect(result).toBe(false);
        })
    });

    test('Invalid league id will return false', async function () {
        await isLeagueAdmin("648e0a6ff1915e7c19e2303a", "748e9013466c1c995745907c")
        .then(result => {
            expect(result).toBe(false);
        })
    });

    test('Valid league id but user is neither the league creator nor a team admin will return false', async function () {
        await isLeagueAdmin("648e0a6ff1915e7c19e2302b", "648e9013466c1c995745907c")
        .then(result => {
            expect(result).toBe(false);
        })
    });

    test('Valid league id and user is the league creator will return true', async function () {
        await isLeagueAdmin("648e0a6ff1915e7c19e2303a", "648e9013466c1c995745907c")
        .then(result => {
            expect(result).toBe(true);
        })
    });

    test('Valid league id and user is the team creator of one of the teams will return true', async function () {
        await isLeagueAdmin("648e145df3d2cb1d615fbd9e", "648e9013466c1c995745907c")
        .then(result => {
            expect(result).toBe(true);
        })
    });
    
});

