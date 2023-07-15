import { Schema } from "mongoose";

// const statSchema = Schema({
//   _id: false,
//   statisticsId: {
//     type: String,
//     unique: validateSchemaProperty(this, "statistic"),
//     required: validateSchemaProperty(this, "statistic"),
//     index: validateSchemaProperty(this, "sport"),
//   },
//   statShortDesc: {
//     type: String,
//     required: validateSchemaProperty(this, "statistic"),
//   },
//   statLongDesc: {
//     type: String,
//     required: validateSchemaProperty(this, "statistic"),
//   },
//   sportsType: {
//     type: Schema.Types.ObjectId,
//     ref: "system_parameter",
//     required: validateSchemaProperty(this, "statistic"),
//   },
// });

const statSchema = Schema({
  _id: false,
  statisticsId: {
    type: String,
    unique: true,
    required: true,
  },
  statShortDesc: {
    type: String,
    required: true,
  },
  statLongDesc: {
    type: String,
    required: true,
  },
  sportsType: {
    type: Schema.Types.ObjectId,
    ref: "system_parameter",
    required: true,
  },
});

export default statSchema;
