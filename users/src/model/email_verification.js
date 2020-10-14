import mongoose from 'mongoose';
import User from './user';

const { Schema } = mongoose;
const EmailVerification = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    email: {
      type: String,
      validate: {
        validator(value) {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value);
        },
        message: '{VALUE} is not a valid email',
      },
      required: [true, 'Email is required'],
    },
    code: String,
    expiration: Date,
    created_at: Date,
    updated_at: Date,
  },
  {
    versionKey: false,
  },
);
EmailVerification.pre('save', function (next) {
  this.log('Saving EmailVerification...');
  next();
});

EmailVerification.post('save', function (doc) {
  this.log('EmailVerification saved!');
});

EmailVerification.method('log', (message) => {
  console.log(`log: ${message}`);
});
export default mongoose.model(
  'EmailVerification',
  EmailVerification,
  'email_verification',
);
