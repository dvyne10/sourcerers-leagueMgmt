import { Schema } from "mongoose";
import { validateSchemaProperty } from "../../utils/schema.js";

const defaultMsgSchema = Schema({
  _id: false,
  notifId: {
    type: String,
    unique: validateSchemaProperty(this, "notification_type"),
    required: validateSchemaProperty(this, "notification_type"),
    index: validateSchemaProperty(this, "notification_type"),
  },
  notifDesc: {
    type: String,
    required: validateSchemaProperty(this, "notification_type"),
  },
  infoOrApproval: {
    type: String,
    enum: ["INFO", "APRV", "APRVREJ"],
    required: validateSchemaProperty(this, "notification_type"),
  },
  message: {
    type: String,
    required: validateSchemaProperty(this, "notification_type"),
  },
});

export default defaultMsgSchema;
