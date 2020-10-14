import response from 'response/default.response';
import { runWarm } from 'utils';
import * as mongoose from 'mongoose';
import FileRepository from '../repository/file.repository';

// Database
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database at ${process.env.CONNECTION_STRING}`);
});
mongoose.connect('mongodb+srv://ennoble-x-file:Y32RL47y76Rgb6P@cluster0.nwbgu.mongodb.net/production_file', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
// eslint-disable-next-line no-console
})
  // eslint-disable-next-line no-console
  .then(() => console.log('Mongodb is connected!'));
mongoose.set('useCreateIndex', true);

// repository
const fileRepository = new FileRepository();

/**
 * Upload file method
 * @returns {Promise<*>}
 */
const content = async (event: any) => {
  const { reference } = event.pathParameters;
  const params = event.queryStringParameters;
  let fileData = null;

  if (reference) {
    fileData = await fileRepository.getFile(reference);
  }

  if (!fileData || !reference) {
    return {
      statusCode: 301,
      headers: {
        Location: 'https://initiative.supun.xyz/placeholder.jpg',
      },
      body: '',
    };
  }

  if (params && params.direct) {
    return {
      statusCode: 301,
      headers: {
        Location: fileData.url,
      },
      body: '',
    };
  }

  return response(fileData);
};
export default runWarm(content);
