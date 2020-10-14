import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeEvaluationCriteria = new Schema(
  {
    criteria: {
      type: String,
      required: [true, 'Criteria is required'],
    },
    description: {
      type: String,
      default: null,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel',
      required: [true, 'Year is required'],
    },
    added_by: {
      type: String,
      required: [true, 'Added By is required'],
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  'InitiativeEvaluationCriteria',
  InitiativeEvaluationCriteria,
  'initiative_evaluation_criteria',
);
