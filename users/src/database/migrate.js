import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const config = require('../../config/app').default;

mongoose.connect(config.db);

const StatusMigrate = require('./status-migrate');
const GenderMigrate = require('./gender-migrate');
const Settings = require('./settings-migrate');
const Roles = require('./role-migrate');
const Admin = require('./admin-migrate');
const Kudos = require('./kudos-migrate');

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});

const migrate = async () => {
  await StatusMigrate.down();
  await StatusMigrate.up();

  await GenderMigrate.down();
  await GenderMigrate.up();

  await Settings.down();
  await Settings.up();

  await Roles.down();
  await Roles.up();

  await Admin.down();
  await Admin.up();

  await Kudos.down();
  await Kudos.up();
};
migrate()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
