import shouldAuth from 'middleware/router/auth.middleware';
import InitiativeYearService from 'service/initiative-year.service';
import response from 'response/default.response';
import InitiativeYear from 'service/item/initiative-year';
import sanitizeHtml from 'sanitize-html';

export default (router: any) => {
  router.use(['/'], shouldAuth());

  router.post('add-year', '/initiative-years', async (ctx: any) => {
    const {
      description, duration, image, initiatives, criteria,
    } = ctx.request.body;
    let { name } = ctx.request.body;

    name = sanitizeHtml(name, {
      allowedTags: [],
      allowedAttributes: {},
      exclusiveFilter: (frame: any) => !frame.text.trim(),
      textFilter: (tagText: string) => tagText.trim(),
    });

    const initiativeYear = new InitiativeYear();
    initiativeYear.name = name;
    initiativeYear.description = description;
    initiativeYear.duration = duration;
    initiativeYear.image = image;
    initiativeYear.initiatives = initiatives;
    initiativeYear.currentUser = ctx.state.user.uuid;
    initiativeYear.criteria = criteria;
    await initiativeYear.add();

    ctx.body = response.response(initiativeYear.getResults());
    ctx.status = 200;
  });

  router.put('update-year', '/initiative-years/:id', async (ctx: any) => {
    const {
      description,
      duration,
      image,
      initiatives,
      criteria,
    } = ctx.request.body;

    const { id } = ctx.params;
    let { name } = ctx.request.body;

    name = sanitizeHtml(name, {
      allowedTags: [],
      allowedAttributes: {},
      exclusiveFilter: (frame: any) => !frame.text.trim(),
      textFilter: (tagText: string) => tagText.trim(),
    });

    const initiativeYear = new InitiativeYear();
    initiativeYear.uuid = id;
    initiativeYear.name = name;
    initiativeYear.description = description;
    initiativeYear.duration = duration;
    initiativeYear.image = image;
    initiativeYear.initiatives = initiatives;
    initiativeYear.currentUser = ctx.state.user.uuid;
    initiativeYear.criteria = criteria;
    await initiativeYear.update();

    ctx.body = response.response(initiativeYear.getResults());
    ctx.status = 200;
  });

  router.get('get-initiatives', '/initiative-years', async (ctx: any) => {
    const initiativeYearService = new InitiativeYearService();
    const initiativeYearContent = await initiativeYearService.list();

    ctx.body = response.response(initiativeYearContent);
    ctx.status = 200;
  });

  router.get('get-initiative', '/initiative-years/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const initiativeYearService = new InitiativeYearService();
    const initiativeYearContent = await initiativeYearService.get(id);

    ctx.body = response.response(initiativeYearContent);
    ctx.status = 200;
  });

  router.get('get-current-year', '/initiative-years/get/current', async (ctx: any) => {
    const initiativeYearService = new InitiativeYearService();
    const initiativeYearContent = await initiativeYearService.getCurrentYear();

    ctx.body = response.response(initiativeYearContent);
    ctx.status = 200;
  });

  router.delete('delete-initiative-year', '/initiative-years/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const initiativeYearService = new InitiativeYearService();
    const initiativeYearContent = await initiativeYearService.delete(id);

    ctx.body = response.response(initiativeYearContent);
    ctx.status = 200;
  });

  router.delete('delete-initiative', '/initiative-years/initiative/:id/:year', async (ctx: any) => {
    const { id, year } = ctx.params;
    const initiativeYearService = new InitiativeYearService();
    const initiativeYearContent = await initiativeYearService.deleteInitiative(id, year);

    ctx.body = response.response(initiativeYearContent);
    ctx.status = 200;
  });

  router.put('update-notes', '/initiative-years/initiative/notes/:id/:year?', async (ctx: any) => {
    const { id, year } = ctx.params;
    const { note } = ctx.request.body;

    const initiativeYearService = new InitiativeYearService();
    const initiativeYearContent = await initiativeYearService
      .setInitiativeObjective(id, note, year);

    ctx.body = response.response(initiativeYearContent);
    ctx.status = 200;
  });

  return router;
};
