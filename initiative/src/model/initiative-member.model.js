import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeMemberModel = new Schema(
  {
    user: {
      type: String,
      required: [true, 'User is required'],
    },
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel',
      required: [true, 'Initiative is required'],
    },
    member_type: {
      type: Schema.Types.ObjectId,
      ref: 'MemberTypeModel',
      required: [true, 'Member Type is required'],
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel',
      required: [true, 'Year is required'],
    },
    note: {
      type: String,
      default: null,
    },
    added_by: {
      type: String,
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeMemberModel', InitiativeMemberModel, 'initiative_members');
