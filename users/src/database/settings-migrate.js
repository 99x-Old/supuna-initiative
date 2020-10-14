import Settings from '../model/settings';

async function up() {
  const data = [];
  await Settings.insertMany(data);
}

async function down() {
  await Settings.deleteMany();
}

module.exports = { up, down };
