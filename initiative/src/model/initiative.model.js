import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeModel = new Schema(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeDepartmentModel',
      required: [true, 'Department is required'],
    },
    image: String,
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('InitiativeModel', InitiativeModel, 'initiatives');
