import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeYearModel = new Schema(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
    },
    name: {
      type: String,
      required: [true, 'Year name is required'],
    },
    duration: {
      from: { type: Date },
      to: { type: Date },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeYearModel', InitiativeYearModel, 'initiative_years');
