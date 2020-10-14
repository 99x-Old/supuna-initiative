import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeYearReviewCycleKeyContributorsModel = new Schema(
  {
    cycle: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeReviewCycleModel',
      required: [true, 'Cycle is required'],
    },
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel',
      required: [true, 'Initiative is required'],
    },
    contributors: [{
      user: { type: String },
      feedback: { type: String },
    }],
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  'InitiativeYearReviewCycleKeyContributorsModel',
  InitiativeYearReviewCycleKeyContributorsModel,
  'initiative_year_review_cycle_key_contributors',
);
