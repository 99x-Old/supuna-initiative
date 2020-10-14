import mongoose from 'mongoose';

const { Schema } = mongoose;

const File = new Schema(
  {
    reference: String,
    url: String,
    data: Object,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

mongoose.models = {};
export default mongoose.model('File', File);
