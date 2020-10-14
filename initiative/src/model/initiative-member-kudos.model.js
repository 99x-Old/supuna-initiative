import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeMemberKudosModel = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel',
      required: [true, 'From is required'],
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel',
      required: [true, 'To is required'],
    },
    kudos: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeKudosModel',
      required: [true, 'Kudos is required'],
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  'InitiativeMemberKudosModel',
  InitiativeMemberKudosModel,
  'initiative_members',
);
