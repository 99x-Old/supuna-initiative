import Status from './status';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserStatus = new Schema({
  status: {
    type: Schema.Types.ObjectId,
    ref: Status,
    required: [true, 'Status is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reason: String,
  created_at: { type: Date, default: Date.now },
});

mongoose.models = {};
export default mongoose.model('UserStatus', UserStatus, 'user_status');
