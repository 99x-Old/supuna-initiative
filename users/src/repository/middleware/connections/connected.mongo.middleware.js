import mongoose from 'mongoose';

export default (user, type) => [
  {
    $match: {
      $or: [
        {
          $and: [
            { second_user: mongoose.Types.ObjectId(user.toString()) },
            { active: true },
            { approved_timestamp: { $nin: ['', null] } },
            { type: mongoose.Types.ObjectId(type.toString()) },
          ],
        },
        {
          $and: [
            { first_user: mongoose.Types.ObjectId(user.toString()) },
            { active: true },
            { approved_timestamp: { $nin: ['', null] } },
            { type: mongoose.Types.ObjectId(type.toString()) },
          ],
        },
      ],
    },
  },
  {
    $addFields: {
      userId: {
        $cond: {
          if: {
            $eq: ['$first_user', mongoose.Types.ObjectId(user.toString())],
          },
          then: '$second_user',
          else: '$first_user',
        },
      },
      type: '$type.type',
      approval_required: '$type.approval_required',
      status: 'connected',
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  {
    $project: {
      type: 1,
      user: 1,
      status: 1,
    },
  },
];
