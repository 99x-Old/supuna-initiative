const runWarm = (lambdaFunc: any): AWSLambda.Handler => async (
  event: any,
  context: any,
) => {
  if (event.source === 'serverless-plugin-warmup') {
    return 'pinged';
  }

  return lambdaFunc(event, context);
};

export default runWarm;
