const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserPassword = new Schema({
  password: String,
  active: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: { type: Date, default: Date.now },
});

UserPassword.pre('save', function (next) {
  const self = this;

  if (!self.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    return bcrypt.hash(self.password, salt, (hashErr, hash) => {
      if (hashErr) return next(hashErr);
      self.password = hash;
      return next();
    });
  });
});

UserPassword.post('save', function (doc) {
  this.log('UserPassword saved!');
});

UserPassword.method('log', (message) => {
  console.log(`log: ${message}`);
});
mongoose.models = {};
export default mongoose.model('UserPassword', UserPassword, 'user_password');
