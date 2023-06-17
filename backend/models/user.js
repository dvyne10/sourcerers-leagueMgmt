const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const teamSchema = Schema({
    teamName: { type: String, required: () => { return this.teamsCreated ? true : false }, index: true },
    location: { type: String, required: () => { return this.teamName ? true : false } },
    division: String,
    teamContactEmail: { type: String, required: () => { return this.teamName ? true : false } },
    description: String,
    sportsTypeId: { type: Schema.Types.ObjectId, ref: 'system_parameter' },
    players: [ {
        _id: false,
        playerId: { type: Schema.Types.ObjectId, ref: 'user' },
        position: { type: Schema.Types.ObjectId, ref: 'system_parameter' },
        jerseyNumber: Number,
        joinedTimestamp: Date,
    }],
    lookingForPlayers: Boolean,
    lookingForPlayersChgTmst: Date,
    teamLogoImage: {
        _id: false, 
        data: Buffer,
        contentType: String
    },
    teamBannerImage: { 
        _id: false,
        data: Buffer,
        contentType: String
    },
  }, {
    timestamps: true
});

const requestsSentSchema = Schema({
    requestType: { type: Schema.Types.ObjectId, ref: 'system_parameter', required: true },
    requestStatus: { type: String, enum: ['PEND', 'APRV', 'RJCT', 'EXP' ], required: true },
    minimumApprovals: { type: Number, required: true },
    approvalsCounter: Number,
    requestExpiry: Date,
    receiverUserId: { type: Schema.Types.ObjectId, ref: 'user' },
    receiverTeamId: { type: Schema.Types.ObjectId },
    receiverLeagueId: { type: Schema.Types.ObjectId, ref: 'league' },
});

const notificationsSchema = Schema({
    readStatus: { type: Boolean, required: true },
    notificationType: { type: Schema.Types.ObjectId, ref: 'system_parameter', required: true  },
    senderUserId: { type: Schema.Types.ObjectId, ref: 'user' },
    senderTeamId: { type: Schema.Types.ObjectId },
    senderLeagueId: { type: Schema.Types.ObjectId, ref: 'league' },
    forAction: {
        _id: false,
        requestId: { type: Schema.Types.ObjectId, ref: 'system_parameter' },
        actionDone: String,
        actionTimestamp: Date
    },
    notificationDetails: String,
});

const userSchema = Schema({
    status: { type: String, enum: ['PEND', 'ACTV', 'BANNED', 'SUSP' ], required: true },
    userName: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    salt: { type: String, unique: true, required: true },
    userType: { type: String, enum: ['USER', 'ADMIN' ], required: true },
    announcementsCreated: [ {
        showInHome: Boolean,
        announcementMsg: String
    } ],
    phoneNumber: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: isRegular },
    province: { type: String, required: isRegular },
    city: { type: String, required: isRegular },
    sportsOfInterest: [ { type: Schema.Types.ObjectId, ref: 'system_parameter', required: isRegular } ],
    teamsCreated: [ teamSchema ],
    profileImage: { 
        _id: false,
        data: Buffer,
        contentType: String
    },
    requestsSent: [ requestsSentSchema ],
    notifications: [ notificationsSchema ],
    successfulLoginDetails: [ {
        _id: false,
        sourceIPAddress: { type: String, required: () => { return this.status != "PEND" ? true : false } },
        timestamp: { type: Date, required: () => { return this.status != "PEND" ? true : false } },
    } ],
    failedLoginDetails: {
        _id: false,
        numberOfLoginTries: Number,
        numberOfFailedLogins: Number,
        failedLogins: [ {
            _id: false,
            sourceIPAddress: { type: String, required: () => { return this.failedLogins ? true : false } },
            timestamp: { type: Date, required: () => { return this.sourceIPAddress ? true : false } },
        } ],
        consecutiveLockedOuts: Number,
        lockedTimestamp: Date
    },
    detailsOTP: {
        _id: false,
        OTP: Number,
        expiryTimeOTP: Date
    },
  }, {
    timestamps: true
});

function isRegular() {
    return this.userTye == 'USER' ? true : false;
}

module.exports = mongoose.model('user', userSchema);