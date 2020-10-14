import mongoose from 'mongoose';
import Status from '../model/status';

async function up() {
  const data = [
    {
      _id: mongoose.Types.ObjectId('5eb524ff812e6a08092c9cfc'),
      status: 'active',
      description: 'User is active',
    },
    {
      _id: mongoose.Types.ObjectId('5f495a77b4565d025e2ccaf9'),
      status: 'pending',
      description: 'Pending activation',
    },
    {
      _id: mongoose.Types.ObjectId('5f493009b4565d025e2ccaf8'),
      status: 'deactivate',
      description: 'User is deactivated',
    },
  ];
  await Status.insertMany(data);
}

async function down() {
  await Status.deleteMany();
}

module.exports = { up, down };
