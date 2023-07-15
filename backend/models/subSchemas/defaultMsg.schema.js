import { Schema } from "mongoose";

// const defaultMsgSchema = Schema({
//   _id: false,
//   notifId: {
//     type: String,
//     unique: validateSchemaProperty(this, "notification_type"),
//     required: validateSchemaProperty(this, "notification_type"),
//     index: validateSchemaProperty(this, "notification_type"),
//   },
//   notifDesc: {
//     type: String,
//     required: validateSchemaProperty(this, "notification_type"),
//   },
//   infoOrApproval: {
//     type: String,
//     enum: ["INFO", "APRV", "APRVREJ"],
//     required: validateSchemaProperty(this, "notification_type"),
//   },
//   message: {
//     type: String,
//     required: validateSchemaProperty(this, "notification_type"),
//   },
// });

const defaultMsgSchema = Schema({
  _id: false,
  notifId: {
    type: String,
    unique: true,
    required: true,
  },
  notifDesc: {
    type: String,
    required: true,
  },
  infoOrApproval: {
    type: String,
    enum: ["INFO", "APRV", "APRVREJ"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default defaultMsgSchema;
