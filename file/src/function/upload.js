import AWS from 'aws-sdk';
import response from 'response/default.response';
import { runWarm } from 'utils';
import { v4 as uuid4 } from 'uuid';
import * as mongoose from 'mongoose';
import FileRepository from '../repository/file.repository';

const FileType = require('file-type');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
});
AWS.config.setPromisesDependency(null);

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

// repository
const fileRepository = new FileRepository();

/**
 * Upload file method
 * @param event
 * @returns {Promise<*>}
 */
const upload = async (event: any) => {
  const data = JSON.parse(event.body);
  const contents = data.file.split(',')[1];
  const mimeInfo: any = await FileType.fromBuffer(Buffer.from(contents, 'base64'));
  const reference = data.reference ? data.reference : uuid4();

  const params = {
    Bucket: 'file-service-2764',
    Key: `${process.env.S3_FOLDER}/${reference}.${mimeInfo.ext}`,
    Body: Buffer.from(contents, 'base64'),
    ContentType: mimeInfo.mime,
    Metadata: {},
  };
  await s3.putObject(params).promise();
  const url = `https://${process.env.S3_BUCKET}.s3.ap-southeast-1.amazonaws.com/${params.Key}`;

  const fileData = {
    reference,
    url,
    data: data.data ? data.data : {},
  };

  try {
    const fileResponse = await fileRepository.addFile(fileData);

    return response({
      fileResponse,
      reference,
      url,
    },
    'Successful!',
    200);
  } catch (error) {
    return response({ message: error.name, stack: error.stack },
      'Successful!',
      400);
  }
};
export default runWarm(upload);
