import Status from './status';
import User from './user';
import Kudos from './kudos';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserKudos = new Schema({
  kudos: {
    type: Schema.Types.ObjectId,
    ref: Kudos,
    required: [true, 'Kudos is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'User is required'],
  },
  givenBy: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'User is required'],
  },
  reason: String,
  created_at: { type: Date, default: Date.now },
});

mongoose.models = {};
export default mongoose.model('UserKudos', UserKudos, 'user_kudos');
