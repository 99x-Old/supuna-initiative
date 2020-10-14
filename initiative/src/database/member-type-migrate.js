import memberType from '../model/member-type.model';

async function up() {
  const data = [
    {
      type: 'lead',
      note: 'Lead Member',
    },
    {
      type: 'member',
      note: 'Member',
    },
  ];
  await memberType.insertMany(data);
}

async function down() {
  await memberType.deleteMany();
}

module.exports = { up, down };
