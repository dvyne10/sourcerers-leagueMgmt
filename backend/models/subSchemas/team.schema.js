import { model, Schema } from "mongoose";


const TeamSchema = Schema(
  {
    teamName: {
      type: String,
      required: () => {
        return this.teamsCreated ? true : false;
      },
      index: true,
    },
    location: {
      type: String,
      required: () => {
        return this.teamName ? true : false;
      },
    },
    division: String,
    teamContactEmail: {
      type: String,
      required: () => {
        return this.teamName ? true : false;
      },
    },
    description: String,
    sportsTypeId: { type: Schema.Types.ObjectId, ref: "system_parameter" },
    players: [
      {
        _id: false,
        playerId: { type: Schema.Types.ObjectId, ref: "user" },
        position: { type: Schema.Types.ObjectId, ref: "system_parameter" },
        jerseyNumber: Number,
        joinedTimestamp: Date,
      },
    ],
    lookingForPlayers: Boolean,
    lookingForPlayersChgTmst: Date,
    teamLogoImage: {
      _id: false,
      data: Buffer,
      contentType: String,
    },
    teamBannerImage: {
      _id: false,
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

export default TeamSchema;
