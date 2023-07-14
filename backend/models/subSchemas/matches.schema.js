import { Schema } from "mongoose";
import matchDetailsSchema from "./matchDetails.schema.js";

const matchesSchema = Schema(
  {
    dateOfMatch: Date,
    locationOfMatch: String,
    team1: matchDetailsSchema,
    team2: matchDetailsSchema,
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    chgRequestedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

export default matchesSchema;
