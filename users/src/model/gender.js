const mongoose = require('mongoose');

const { Schema } = mongoose;

const Gender = new Schema(
  {
    _id: Schema.Types.ObjectId,
    gender: String,
  },
  {
    versionKey: false,
  },
);
Gender.pre('save', function (next) {
  this.log('Saving Gender...');
  next();
});

Gender.post('save', function (doc) {
  this.log('Gender saved!');
});

Gender.method('log', (message) => {
  console.log(`log: ${message}`);
});

export default mongoose.model('Gender', Gender);
