const mongoose = require('mongoose');

const { Schema } = mongoose;

const Section = new Schema({
  name: String,
  title: {
    text: {
      type: String,
      minlength: 3,
    },
    readonly: { type: Boolean, default: false },
  },
  tags: {
    type: [{
      type: String,
      minlength: 3,
    }],
    validate: [function (v: any): boolean {
      return Array.isArray(v) && (v.length > 0 || this.text.length > 10);
    }],
  },
  text: {
    type: String,
    validate: [function (v: any): boolean {
      return (v.length > 10 || this.tags.length > 0);
    }],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  position: {
    column: { type: Number, default: 1 },
    index: { type: Number, default: 1 },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
},
{
  versionKey: false,
});

mongoose.models = {};
export default mongoose.model('Section', Section, 'sections');
