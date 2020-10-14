import Role from '../model/role';

async function up() {
  const data = [
    {
      _id: '5f454585ae00a92aa895248b',
      role: 'super-admin',
      permission: ['all'],
    },
    {
      _id: '5f454585ae00a92aa895248c',
      role: 'initiative-evaluator',
      permission: [
        'create-initiative-year',
        'add-initiative',
        'delete-initiative',
        'edit-initiative',
        'add-user-initiative',
        'remove-user-initiative',
        'set-initiative-evaluation',
        'create-review-cycle',
      ],
    },
    {
      _id: '5f454585ae00a92aa895248d',
      role: 'initiative-lead',
      permission: [
        'add-initiative-action',
        'delete-initiative-action',
        'edit-initiative-action',
        'assign-user-initiative-action',
        'set-deadline-key-initiative-action',
        'set-progress-key-initiative-action',
        'add-comment-key-initiative-action',
        'view-action-dashboard',
        'view-assigned-action',
        'set-initiative-meeting',
      ],
    },
    {
      _id: '5f454585ae00a92aa895248e',
      role: 'user',
      permission: [
        'join-initiative',
        'join-initiative-year',
        'view-assigned-action',
        'view-initiative',
        'view-initiative-progress',
        'participate-initiative-meeting',
        'rate-contribute-users',
      ],
    },
  ];
  await Role.insertMany(data);
}

async function down() {
  await Role.deleteMany();
}

module.exports = {
  up,
  down,
};
