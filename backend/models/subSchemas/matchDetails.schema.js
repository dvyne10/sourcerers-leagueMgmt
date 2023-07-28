import { Schema } from "mongoose";

const matchDetailsSchema = Schema(
    {
      _id: false,
      teamId: { type: Schema.Types.ObjectId, required: true },
      finalScore: Number,
      finalScorePending: Number,
      leaguePoints: Number,
      leaguePointsPending: Number,
      players: [
        {
          _id: false,
          playerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
          statistics: [
            {
              _id: false,
              statisticsId: {
                type: Schema.Types.ObjectId,
                ref: "system_parameter",
                required: true,
              },
              value: Number,
            },
          ],
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  export default matchDetailsSchema;