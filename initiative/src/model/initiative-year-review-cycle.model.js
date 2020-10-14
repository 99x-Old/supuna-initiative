import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeReviewCycleModel = new Schema(
  {
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel',
      required: [true, 'Year is required'],
    },
    uuid: {
      type: String,
      required: [true, 'uuid is required'],
    },
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      default: null,
    },
    duration: {
      from: { type: Date },
      to: { type: Date },
    },
    done: {
      type: Boolean,
      default: false,
    },
    added_by: {
      type: String,
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeReviewCycleModel', InitiativeReviewCycleModel, 'initiative_review_cycles');
