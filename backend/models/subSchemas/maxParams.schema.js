import { Schema } from "mongoose";

const maxParmsSchema = Schema({
  _id: false,
  maxActiveLeaguesCreated: Number,
  startLeagueApprovalExp: Number,
  notifHousekeeping: Number,
});

export default maxParmsSchema;
