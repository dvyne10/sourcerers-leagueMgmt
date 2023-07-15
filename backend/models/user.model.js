import { model, Schema } from "mongoose";
import notificationsSchema from "./subSchemas/notification.schema.js";
import requestsSentSchema from "./subSchemas/request.schema.js";
import teamschema from "./subSchemas/team.schema.js"

const userSchema = Schema(
  {
    status: {
      type: String,
      enum: ["PEND", "ACTV", "BANNED", "SUSP"],
      required: true,
    },
    userName: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    salt: { type: String, unique: true, required: true }, 
    userType: { type: String, enum: ["USER", "ADMIN"], required: true },
    announcementsCreated: [
      {
        showInHome: Boolean,
        announcementMsg: String,
      },
    ],
    phoneNumber: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: isRegular },
    province: { type: String, required: isRegular },
    city: { type: String, required: isRegular },
    sportsOfInterest: [
      {
        type: Schema.Types.ObjectId,
        ref: "system_parameter",
        required: isRegular,
      },
    ],
    teamsCreated: [teamschema],
    profileImage: {
      _id: false,
      data: Buffer,
      contentType: String,
    },
    requestsSent: [requestsSentSchema],
    notifications: [notificationsSchema],
    successfulLoginDetails: [
      {
        _id: false,
        sourceIPAddress: {
          type: String,
          required: () => {
            return this.status != "PEND" ? true : false;
          },
        },
        timestamp: {
          type: Date,
          required: () => {
            return this.status != "PEND" ? true : false;
          },
        },
      },
    ],
    failedLoginDetails: {
      _id: false,
      numberOfLoginTries: Number,
      numberOfFailedLogins: Number,
      failedLogins: [
        {
          _id: false,
          sourceIPAddress: {
            type: String,
            required: () => {
              return this.failedLogins ? true : false;
            },
          },
          timestamp: {
            type: Date,
            required: () => {
              return this.sourceIPAddress ? true : false;
            },
          },
        },
      ],
      consecutiveLockedOuts: Number,
      lockedTimestamp: Date,
    },
    detailsOTP: {
      _id: false,
      OTP: Number,
      expiryTimeOTP: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);
