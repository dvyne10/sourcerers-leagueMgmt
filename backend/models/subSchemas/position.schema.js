import { Schema } from "mongoose";

// const positionSchema = Schema({
//   _id: false,
//   positionId: {
//     type: String,
//     unique: validateSchemaProperty(this, "position"),
//     required: validateSchemaProperty(this, "position"),
//     index: validateSchemaProperty(this, "sport"),
//   },
//   positionDesc: {
//     type: String,
//     required: validateSchemaProperty(this, "position"),
//   },
//   sportsType: {
//     type: Schema.Types.ObjectId,
//     ref: "system_parameter",
//     required: validateSchemaProperty(this, "position"),
//   },
// });

const positionSchema = Schema({
  _id: false,
  positionId: {
    type: String,
    unique: true,
    required: true,
  },
  positionDesc: {
    type: String,
    required: true,
  },
  sportsType: {
    type: Schema.Types.ObjectId,
    ref: "system_parameter",
    required: true,
  },
});

export default positionSchema;
