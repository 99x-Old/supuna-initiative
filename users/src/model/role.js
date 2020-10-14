import mongoose from 'mongoose';

const { Schema } = mongoose;

const Role = new Schema(
  {
    _id: Schema.Types.ObjectId,
    role: {
      type: String,
      validate: {
        validator(value: string): boolean {
          return value.length >= 3;
        },
        message: 'Role must have at least 3 characters',
      },
      required: [true, 'Name is required'],
    },
    permission: [{
      type: String,
      validate: {
        validator(value: string): boolean {
          return value.length >= 3;
        },
        message: 'Permission must have at least 3 characters',
      },
      required: [true, 'Name is required'],
    }],
    uuid: String,
    created_at: Date,
    updated_at: Date,
  },
  {
    versionKey: false,
  },
);
export default mongoose.model('Role', Role);
