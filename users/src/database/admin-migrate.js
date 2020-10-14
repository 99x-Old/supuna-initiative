import User from '../model/user';
import UserStatus from '../model/user_status';

async function up() {
  const data = [
    {
      _id: '5f45485a7e7f4e306e8e436f',
      email: 'spmsupun@live.com',
      first_name: 'Supun',
      last_name: 'Praneeth',
      uuid: '0f63071b-4eb2-4cac-b7a2-007ffb9f3842',
      oid: '474fa7c4-dc7a-42d7-9098-88363972e648',
      role: ['5f454585ae00a92aa895248b'],
    },
  ];
  await User.insertMany(data);

  const dataStatus = [
    { status: '5eb524ff812e6a08092c9cfc', user: '5f45485a7e7f4e306e8e436f' },
  ];
  await UserStatus.insertMany(dataStatus);
}

async function down() {
  await User.deleteMany();
}

module.exports = { up, down };
