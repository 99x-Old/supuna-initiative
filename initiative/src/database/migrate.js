import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const config = require('../../config/app').default;

mongoose.connect(config.db);

const StatusMigrate = require('./member-type-migrate');

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});

const migrate = async () => {
  await StatusMigrate.down();
  await StatusMigrate.up();
};
migrate()
  .then(() => {
    process.exit();
  })
  .catch(() => {
    process.exit();
  });
