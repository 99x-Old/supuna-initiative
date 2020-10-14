import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotificationModel = new Schema(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
    },
    text: {
      type: String,
      required: [true, 'text is required'],
    },
    to_user: {
      type: String,
      required: [true, 'User is required'],
    },
    from_user: {
      type: String,
      default: null,
    },
    red: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: { },
    },
    created_at: { type: Date, default: Date.now },
  },
);

export default mongoose.model('NotificationModel', NotificationModel);
