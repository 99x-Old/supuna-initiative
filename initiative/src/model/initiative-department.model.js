import mongoose from 'mongoose';

const { Schema } = mongoose;

const InitiativeDepartmentModel = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Department is required'],
      validate: {
        validator(val: string): boolean {
          return val.length >= 5 || val.length === 0;
        },
        message: () => 'Name must be at least 5 characters long',
      },
    },
    description: {
      type: String,
      default: null,

    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model(
  'InitiativeDepartmentModel',
  InitiativeDepartmentModel,
  'initiative_departments',
);
