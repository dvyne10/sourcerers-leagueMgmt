import { Schema, model } from "mongoose";
import sportsSchema from "./subSchemas/sports.schema";
import statSchema from "./subSchemas/stat.schema";
import positionSchema from "./subSchemas/position.schema";
import loginSchema from "./subSchemas/login.schema";
import announcementsSchema from "./subSchemas/announcements.schema";
import maxParmsSchema from "./subSchemas/maxParams.schema";
import defaultMsgSchema from "./subSchemas/defaultMsg.schema";

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
