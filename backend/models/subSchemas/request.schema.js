import { model, Schema } from "mongoose";

const RequestsSentSchema = Schema({
  requestType: {
    type: Schema.Types.ObjectId,
    ref: "system_parameter",
    required: true,
  },
  requestStatus: {
    type: String,
    enum: ["PEND", "APRV", "RJCT", "EXP"],
    required: true,
  },
  minimumApprovals: { type: Number, required: true },
  approvalsCounter: Number,
  requestExpiry: Date,
  receiverUserId: { type: Schema.Types.ObjectId, ref: "user" },
  receiverTeamId: { type: Schema.Types.ObjectId },
  receiverLeagueId: { type: Schema.Types.ObjectId, ref: "league" },
});

export default RequestsSentSchema;
