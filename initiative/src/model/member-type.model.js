import mongoose from 'mongoose';

const { Schema } = mongoose;

const MemberTypeModel = new Schema(
  {
    type: {
      type: String,
      required: [true, 'Name is required'],
    },
    note: {
      type: String,
      required: [true, 'Note is required'],
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('MemberTypeModel', MemberTypeModel, 'member_types');
