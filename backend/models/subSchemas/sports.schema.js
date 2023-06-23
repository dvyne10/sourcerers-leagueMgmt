import { Schema } from "mongoose";
import { validateSchemaProperty } from "../../utils/schema";

const sportsSchema = Schema({
  _id: false,
  sportsTypeId: {
    type: String,
    unique: validateSchemaProperty(this, "sport"),
    required: validateSchemaProperty(this, "sport"),
    index: validateSchemaProperty(this, "sport"),
  },
  sportsName: { type: String, required: validateSchemaProperty(this, "sport") },
});

export default sportsSchema;
