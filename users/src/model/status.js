const mongoose = require('mongoose');

const { Schema } = mongoose;

const Status = new Schema(
  {
    _id: Schema.Types.ObjectId,
    status: String,
    description: String,
  },
  {
    versionKey: false,
  },
);

Status.pre('save', function (next) {
  this.log('Saving Status...');
  next();
});

Status.post('save', function (doc) {
  this.log('Status saved!');
});

Status.method('log', (message) => {
  console.log(`log: ${message}`);
});
export default mongoose.model('Status', Status, 'status');
