import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeActionModel = new Schema(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
    },
    name: {
      type: String,
      required: [true, 'Action is required'],
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel',
    }],
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
    description: {
      type: String,
      default: null,
    },
    deadline: { type: Date, default: null },
    sub_actions: [{
      value: String,
      done: Boolean,
    }],
    done: {
      type: Boolean,
      default: false,
    },
    added_by: {
      type: String,
      required: [true, 'Added By is required'],
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeActionModel', InitiativeActionModel, 'initiative_actions');
