import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeMemberRatingModel = new Schema(
  {
    user: {
      type: String,
      required: [true, 'User is required'],
    },
    rated_by: {
      type: String,
      required: [true, 'Rated By is required'],
    },
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel',
      required: [true, 'Initiative  is required'],
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
    },
    note: {
      type: String,
      default: null,
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  'InitiativeMemberRatingModel',
  InitiativeMemberRatingModel,
  'initiative_member_ratings',
);
