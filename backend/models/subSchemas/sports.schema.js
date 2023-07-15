import { Schema } from "mongoose";
import { validateSchemaProperty } from "../../utils/schema.js";

// const sportsSchema = Schema({
//   _id: false,
//   sportsTypeId: {
//     type: String,
//     unique: validateSchemaProperty(this, "sport"),
//     required: validateSchemaProperty(this, "sport"),
//     index: validateSchemaProperty(this, "sport"),
//   },
//   sportsName: { type: String, required: validateSchemaProperty(this, "sport") },
// });

const sportsSchema = Schema({
  _id: false,
  sportsTypeId: {
    type: String,
    unique: true,
    required: true,
  },
  sportsName: { type: String, required: true },
});

export default sportsSchema;
