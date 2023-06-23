import { Schema } from "mongoose";

const statSchema = Schema({
  _id: false,
  statisticsId: {
    type: String,
    unique: validateSchemaProperty(this, "statistic"),
    required: validateSchemaProperty(this, "statistic"),
    index: validateSchemaProperty(this, "sport"),
  },
  statShortDesc: {
    type: String,
    required: validateSchemaProperty(this, "statistic"),
  },
  statLongDesc: {
    type: String,
    required: validateSchemaProperty(this, "statistic"),
  },
  sportsType: {
    type: Schema.Types.ObjectId,
    ref: "system_parameter",
    required: validateSchemaProperty(this, "statistic"),
  },
});

export default statSchema;
