import shouldAuth from 'middleware/router/auth.middleware';
import response from 'response/default.response';
import ReviewCycle from 'service/item/review-cycle';
import InitiativeReviewService from 'service/initiative-review.service';

export default (router: any) => {
  router.use(['/'], shouldAuth());

  router.post('create-review-cycle', '/initiative-review-cycle', async (ctx: any) => {
    const { title, duration, description } = ctx.request.body;

    const review = new ReviewCycle();
    review.title = title;
    review.duration = duration;
    review.description = description;
    await review.add();
    ctx.body = response.response(review.getResults());
    ctx.status = 200;
  });

  router.get('list-review-cycle', '/initiative-review-cycle/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeReviewService = new InitiativeReviewService();
    const cycle = await initiativeReviewService.getReviewCycle(id);

    ctx.body = response.response(cycle);
    ctx.status = 200;
  });

  router.get('list-review-cycles', '/initiative-review-cycle', async (ctx: any) => {
    const initiativeReviewService = new InitiativeReviewService();
    const list = await initiativeReviewService.list();

    ctx.body = response.response(list);
    ctx.status = 200;
  });

  router.put('save-initiative-review-cycles', '/initiative-review-cycle/save/initiative/:cycle/:initiative', async (ctx: any) => {
    const { ratings, notes, contributors } = ctx.request.body;
    const { cycle, initiative } = ctx.params;

    const initiativeReviewService = new InitiativeReviewService();
    await initiativeReviewService.addInitiative(cycle, initiative, ratings, notes, contributors);

    ctx.body = response.response({});
    ctx.status = 200;
  });
  router.post('publish-initiative-review-cycles', '/initiative-review-cycle/publish/initiative/:cycle', async (ctx: any) => {
    const { cycle } = ctx.params;

    const initiativeReviewService = new InitiativeReviewService();
    const cycleData = await initiativeReviewService.publishCycle(cycle);

    ctx.body = response.response(cycleData);
    ctx.status = 200;
  });

  return router;
};
