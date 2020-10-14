import shouldAuth from 'middleware/router/auth.middleware';
import response from 'response/default.response';
import RatingService from 'service/rating.service';

export default (router: any) => {
  router.use(['/rate'], shouldAuth());

  router.put('rate-user', '/rate/user/:userId', async (ctx: any) => {
    const { userId } = ctx.params;
    const { rate, initiativeId, note } = ctx.request.body;

    const review = new RatingService();
    review._currentUser = ctx.state.user.uuid;
    const result = await review.rateUser(userId, initiativeId, rate, note);

    ctx.body = response.response(result);
    ctx.status = 200;
  });

  router.get('get-rating', '/rate/user/:userId/:initiativeId', async (ctx: any) => {
    const { userId, initiativeId } = ctx.params;

    const review = new RatingService();
    review._currentUser = ctx.state.user.uuid;
    const result = await review.getUserRatings(userId, initiativeId);

    ctx.body = response.response(result);
    ctx.status = 200;
  });

  return router;
};
