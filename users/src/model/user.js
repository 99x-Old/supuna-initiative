import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import Gender from './gender';
import Role from './role';

const { Schema } = mongoose;

const User = new Schema(
  {
    first_name: {
      type: String,
      validate: {
        validator(value: string): boolean {
          return value.length >= 3;
        },
        message: 'Name must have at least 3 characters',
      },
      required: [true, 'Name is required'],
    },
    last_name: {
      type: String,
      // custom validation for name
      validate: {
        validator(value: string): boolean {
          return value.length >= 3;
        },
        message: 'Name must have at least 3 characters',
      },
      required: [true, 'Name is required'],
    },
    bio: String,
    birth: {
      type: Date,
    },
    email: {
      type: String,
      index: {
        unique: true,
      },
      validate: {
        validator(value: string): boolean {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value);
        },
        message: '{VALUE} is not a valid email',
      },
      required: [true, 'Email is required'],
      unique: true,
    },
    mobile: Number,
    gender: {
      type: Schema.Types.ObjectId,
      ref: Gender,
    },
    role: [{
      type: Schema.Types.ObjectId,
      ref: Role,
    }],
    uuid: String,
    oid: String,
    created_at: Date,
    updated_at: Date,
  },
  {
    versionKey: false,
  },
);

User.plugin(mongoosePaginate);

export default mongoose.model('User', User);
