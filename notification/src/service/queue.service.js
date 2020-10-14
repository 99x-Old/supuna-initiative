const Bull = require('bull');

const queue = new Bull('Queue', { redis: { port: 6379, host: 'redis' } });

export default async (task: any, name: string = 'job') => {
  queue.process(name, async (job: any, done: any) => {
    task().then(() => {
      job.progress(100);
      done();
    });
  });

  await queue.add(name, { priority: 3 }).then(() => {
    // eslint-disable-next-line no-console
    console.log('Job Started');
  });

  queue.on('completed', () => {
    // eslint-disable-next-line no-console
    console.log('Job Completed');
  });
  // eslint-disable-next-line no-console
  queue.on('error', (err: Error) => { console.log('error', err); });
  // eslint-disable-next-line no-console
  queue.on('failed', (job: any, err: Error) => { console.log('failed', job.jobId, err); });
};
export const list = () => queue.getJobs().then();
