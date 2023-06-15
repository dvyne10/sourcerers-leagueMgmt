const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const matchDetailsSchema = Schema({
    teamId: { type: Schema.Types.ObjectId, required: true  },
    finalScore: Number,
    finalScorePending: Number,
    leaguePoints: Number,
    leaguePointsPending: Number,
    players: [{
        _id: false,
        playerId: { type: Schema.Types.ObjectId, ref: 'user', required: true  },
        statistics: [{
            _id: false,
            statisticsId: { type: Schema.Types.ObjectId, ref: 'system_parameter', required: true },
            value: Number
        }],
    }]
  }, {
    timestamps: true
});

const matchesSchema = Schema({
    dateOfMatch: Date,
    locationOfMatch: String,
    team1: matchDetailsSchema,
    team2: matchDetailsSchema,
    updatedBy : { type: Schema.Types.ObjectId, ref: 'user' },
    chgRequestedBy : { type: Schema.Types.ObjectId, ref: 'user' },
  }, {
    timestamps: true
});

const leagueSchema = Schema({
    leagueName: { type: String, required: true, index: true },
    status: { type: String, enum: ['NS', 'ST', 'EN' ], required: true },
    location: { type: String, required: true },
    division: String,
    description: String,
    sportsTypeId: { type: Schema.Types.ObjectId, ref: 'system_parameter' },
    ageGroup: { type: String, required: true },
    numberOfTeams: { type: Number, required: true },
    numberOfRounds: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teams: [ {
        _id: false,
        teamId: { type: Schema.Types.ObjectId },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'user' },
        joinedTimestamp: Date,
    }],
    lookingForTeams: Boolean,
    lookingForTeamsChgBy: { type: Schema.Types.ObjectId, ref: 'user' },
    lookingForTeamsChgTmst: Date,
    leagueLogoImage: {
        _id: false, 
        data: Buffer,
        contentType: String
    },
    leagueBannerImage: { 
        _id: false,
        data: Buffer,
        contentType: String
    },
    matches: [ matchesSchema ],
    createdBy : { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy : { type: Schema.Types.ObjectId, ref: 'user' },
  }, {
    timestamps: true
});

module.exports = mongoose.model('league', leagueSchema);