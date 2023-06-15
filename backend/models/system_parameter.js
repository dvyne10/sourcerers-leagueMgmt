const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sportsSchema = Schema({
    _id: false,
    sportsTypeId: { type: String, unique: isSport, required: isSport, index: isSport },
    sportsName: { type: String, required: isSport },
})

function isSport() {
    return this.parameterId == 'sport' ? true : false;
}

const statSchema = Schema({
    _id: false,
    statisticsId: { type: String, unique: isStatistic, required: isStatistic, index: isSport },
    statShortDesc: { type: String, required: isStatistic },
    statLongDesc: { type: String, required: isStatistic },
    sportsType: { type: Schema.Types.ObjectId, ref: 'system_parameter', required: isStatistic },
})

function isStatistic() {
    return this.parameterId == 'statistic' ? true : false;
}

const positionSchema = Schema({
    _id: false,
    positionId: { type: String, unique: isPosition, required: isPosition, index: isSport },
    positionDesc: { type: String, required: isPosition },
    sportsType: { type: Schema.Types.ObjectId, ref: 'system_parameter', required: isPosition },
})

function isPosition() {
    return this.parameterId == 'position' ? true : false;
}

const loginSchema = Schema({
    _id: false,
    numberOfLoginDtlsToKeep: Number,
    defaultLoginTries: Number,
    maxAdditionalLoginTries: Number,
    lockedAccountTiming: Number,
    otpExpiry: Number,
    minPasswordLength: Number, 
    passwordCriteria: {
        _id: false,
        capitalLetterIsRequired: Boolean,
        capitalLettersList: String,
        specialCharacterIsRequired: Boolean,
        specialCharsList: String,
        numberIsRequired: Boolean,
        numbersList: String,
    },
})

const announcementsSchema = Schema({
    _id: false,
    defaultMsgTeamAncmt: String,
    defaultMsgLeagueAncmt: String,
})

const maxParmsSchema = Schema({
    _id: false,
    maxActiveLeaguesCreated: Number,
    startLeagueApprovalExp: Number,
    notifHousekeeping: Number,
})

const defaultMsgSchema = Schema({
    _id: false,
    notifId: { type: String, unique: isNotifType, required: isNotifType, index: isNotifType },
    infoOrApproval: { type: String, enum: ['INFO', 'APRV', 'APRVREJ' ], required: isNotifType },
    message: { type: String, required: isNotifType }
})

function isNotifType() {
    return this.parameterId == 'notification_type' ? true : false;
}

const sysParamSchema = Schema({
    parameterId: { type: String, required: true },
    sport: sportsSchema,
    statistic: statSchema,
    position: positionSchema,
    login: loginSchema,
    dfltAnnouncement: announcementsSchema,
    maxParms: maxParmsSchema,
    notification_type: defaultMsgSchema,
    createdBy : { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy : { type: Schema.Types.ObjectId, ref: 'user' },
  }, {
    timestamps: true
});

module.exports = mongoose.model('system_parameter',sysParamSchema);