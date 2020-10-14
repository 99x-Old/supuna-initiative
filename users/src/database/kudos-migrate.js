import Kudos from '../model/kudos';

async function up() {
  const data = [
    {
      _id: '5f67a28b1950120989c26be2',
      kudos: 'Team Player',
      description: ' ',
      uuid: '62449b37-88c6-4b77-a1b7-f324a1a258cd',
    }, {
      _id: '5f67a28b1950120989c26be3',
      kudos: 'Thank You',
      description: ' ',
      uuid: 'bfb7dc61-b2d8-44f9-bb00-c0a1ec942bfe',
    }, {
      _id: '5f67a28b1950120989c26be4',
      kudos: 'Great Job',
      description: ' ',
      uuid: 'ba464bf8-f807-4397-86ef-596131f040bb',
    }, {
      _id: '5f67a28b1950120989c26be5',
      kudos: 'Batman',
      description: ' ',
      uuid: '326f7934-a41d-4d61-aa21-9a33b57d7d1a',
    }, {
      _id: '5f67a28b1950120989c26be6',
      kudos: 'Amazing Mentor',
      description: ' ',
      uuid: '41dd4471-8b3f-415c-bcdc-3c963e403515',
    }, {
      _id: '5f67a28b1950120989c26be7',
      kudos: 'The Joker',
      description: ' ',
      uuid: '6c33207c-00c5-4270-9415-282425e253d7',
    }, {
      _id: '5f67a28b1950120989c26be8',
      kudos: 'God',
      description: ' ',
      uuid: '4b2aab9d-74f9-425f-9906-9361b294a7bf',
    },
  ];
  await Kudos.insertMany(data);
}

async function down() {
  await Kudos.deleteMany();
}

module.exports = {
  up,
  down,
};
