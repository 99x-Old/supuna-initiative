import response from 'response/default.response';
import { runWarm } from 'utils';
import * as mongoose from 'mongoose';
import FileRepository from '../repository/file.repository';
import authMiddleware from '../middleware/auth.middleware';

// Database
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database at ${process.env.CONNECTION_STRING}`);
});
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
// eslint-disable-next-line no-console
}).then(() => console.log('Mongodb is connected!'));
mongoose.set('useCreateIndex', true);

/**
 * Upload file method
 * @returns {Promise<*>}
 */
const hello = async (event: any) => {
  const auth = authMiddleware(event.headers);

  if (auth) {
    // eslint-disable-next-line no-console
    console.log(auth);
    return response({}, 'Authed');
  }
  mongoose.connection.close();
  return response({ a: 88 }, 'Unauthorized', 400);
};
export default runWarm(hello);
