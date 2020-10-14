import Gender from '../model/gender';

async function up() {
  const data = [
    { _id: '5eb51e347a3f310661935c35', gender: 'Male' },
    { _id: '5eb51e347a3f310661935c36', gender: 'Female' },
    { _id: '5eb51e347a3f310661935c37', gender: 'Other' },
  ];
  await Gender.insertMany(data);
}

async function down() {
  await Gender.deleteMany();
}

module.exports = { up, down };
