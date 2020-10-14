export default [
  {
    $lookup: {
      from: 'user_status',
      localField: '_id',
      foreignField: 'user',
      as: 'status',
    },
  },
  {
    $lookup: {
      from: 'roles',
      localField: 'role',
      foreignField: '_id',
      as: 'role',
    },
  },
  {
    $project: {
      first_name: 1,
      last_name: 1,
      bio: 1,
      birth: 1,
      gender: 1,
      genderList: 1,
      uuid: 1,
      email: 1,
      status: { $slice: ['$status', -1] },
      role: 1,
    },
  },
  {
    $unwind: '$status',
  },
  {
    $lookup: {
      from: 'status',
      localField: 'status.status',
      foreignField: '_id',
      as: 'status',
    },
  },
  {
    $unwind: '$status',
  },
];
