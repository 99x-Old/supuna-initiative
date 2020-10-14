import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeKudosModel = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Rate is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: null,
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  'InitiativeKudosModel',
  InitiativeKudosModel,
  'initiative_kudos',
);
