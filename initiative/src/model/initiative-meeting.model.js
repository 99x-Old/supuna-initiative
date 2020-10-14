import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeMeetingModel = new Schema(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date and Time is required'],
    },
    time: {
      type: Date,
      required: [true, 'Time and Time is required'],
    },
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel',
      required: [true, 'Initiative is required'],
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel',
    }],
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel',
      required: [true, 'Year is required'],
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required'],
      validate: {
        validator(val: string): boolean {
          return val.length >= 5 || val.length === 0;
        },
        message: () => 'name must be at least 5 characters long',
      },
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    added_by: {
      type: String,
      required: [true, 'Added By is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'canceled', 'finished'],
      default: 'pending',
    },
    started_at: { type: Date, default: null },
    finished_at: { type: Date, default: null },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeMeetingModel', InitiativeMeetingModel, 'initiative_meetings');
