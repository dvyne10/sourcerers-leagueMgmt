import { model, Schema } from "mongoose";

const notificationsSchema = Schema(
  {
    readStatus: { type: Boolean, required: true },
    notificationType: {
      type: Schema.Types.ObjectId,
      ref: "system_parameter",
      required: true,
    },
    senderUserId: { type: Schema.Types.ObjectId, ref: "user" },
    senderTeamId: { type: Schema.Types.ObjectId },
    senderLeagueId: { type: Schema.Types.ObjectId, ref: "league" },
    forAction: {
      _id: false,
      requestId: { type: Schema.Types.ObjectId, ref: "system_parameter" },
      actionDone: String,
      actionTimestamp: Date,
    },
    notificationMsg: String,
    notificationDetails: String,
  },
  {
    timestamps: true,
  }
);

export default notificationsSchema;
