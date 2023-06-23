import { Schema } from "mongoose";

const announcementsSchema = Schema({
  _id: false,
  defaultMsgTeamAncmt: String,
  defaultMsgLeagueAncmt: String,
});

export default announcementsSchema;
