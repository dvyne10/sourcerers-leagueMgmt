import { Schema, model } from "mongoose";
import sportsSchema from "./subSchemas/sports.schema.js";
import statSchema from "./subSchemas/stat.schema.js";
import positionSchema from "./subSchemas/position.schema.js";
import loginSchema from "./subSchemas/login.schema.js";
import announcementsSchema from "./subSchemas/announcements.schema.js";
import maxParmsSchema from "./subSchemas/maxParams.schema.js";
import defaultMsgSchema from "./subSchemas/defaultMsg.schema.js";

const sysParamSchema = Schema(
  {
    parameterId: { type: String, required: true },
    sport: sportsSchema,
    statistic: statSchema,
    position: positionSchema,
    login: loginSchema,
    dfltAnnouncement: announcementsSchema,
    maxParms: maxParmsSchema,
    notification_type: defaultMsgSchema,
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

export default model("system_parameter", sysParamSchema);
