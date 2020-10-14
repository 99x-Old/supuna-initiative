import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeObjectiveModel = new Schema(
  {
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel',
      required: [true, 'Initiative is required'],
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel',
      required: [true, 'Year is required'],
    },
    objective: {
      type: String,
      default: null,
    },
    added_by: {
      type: String,
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeObjectiveModel', InitiativeObjectiveModel, 'initiative_objectives');
