const mongoose = require('mongoose');

const { Schema } = mongoose;

const Settings = new Schema(
  {
    name: String,
    settings: Object,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model('Settings', Settings);
