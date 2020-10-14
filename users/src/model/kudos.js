import mongoose from 'mongoose';

const { Schema } = mongoose;

const Kudos = new Schema(
  {
    _id: Schema.Types.ObjectId,
    kudos: {
      type: String,
      validate: {
        validator(value: string): boolean {
          return value.length >= 3;
        },
        message: 'Kudos must have at least 3 characters',
      },
      required: [true, 'Kudos is required'],
    },
    description: String,
    uuid: String,
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);
export default mongoose.model('Kudos', Kudos);
