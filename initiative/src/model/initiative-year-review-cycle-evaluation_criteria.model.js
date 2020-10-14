import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeReviewCycleEvaluationCriteriaModel = new Schema(
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
    evaluation_criteria: [{
      criteria: {
        type: Schema.Types.ObjectId,
        ref: 'InitiativeEvaluationCriteria',
        required: [true, 'Criteria is required'],
      },
      points: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      note: {
        type: String,
        default: null,
      },
    }],
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  InitiativeReviewCycleEvaluationCriteriaModel,
  InitiativeReviewCycleEvaluationCriteriaModel,
  'initiative_year_review_cycle_evaluation_criteria',
);
