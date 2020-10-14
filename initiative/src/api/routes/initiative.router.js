import shouldAuth from 'middleware/router/auth.middleware';
import response from 'response/default.response';
import InitiativeService from 'service/initiative.service';
import sanitizeHtml from 'sanitize-html';
import Initiative from 'service/item/initiative';
import InitiativeAction from '../../service/item/initiative-action';
import InitiativeMeeting from '../../service/item/initiative-meeting';

export default (router: any) => {
  router.use(['/on-auth'], shouldAuth());

  router.get('check-auth', '/on-auth', async (ctx: any) => {
    ctx.body = response.response({ a: 'Passed the auth!' });
    ctx.status = 200;
  });

  router.post('add-initiative', '/initiatives', async (ctx: any) => {
    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;

    const { image, description, department } = ctx.request.body;
    let { name } = ctx.request.body;

    name = sanitizeHtml(name, {
      allowedTags: [],
      allowedAttributes: {},
      exclusiveFilter: (frame: any) => !frame.text.trim(),
      textFilter: (tagText: string) => tagText.trim(),
    });

    const initiative = new Initiative();
    initiative.name = name;
    initiative.image = image;
    initiative.department = department;
    initiative.description = description;

    const initiativeContent = await initiativeService.add(initiative);

    ctx.body = response.response(initiativeContent);
    ctx.status = 200;
  });

  router.get('get-initiative', '/initiatives', async (ctx: any) => {
    const { currentYear } = ctx.request.query;
    const initiative = new InitiativeService();
    initiative._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiative.list(currentYear);

    ctx.body = response.response(initiativeContent);
    ctx.status = 200;
  });

  router.get('get-initiative', '/initiatives/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.get(id);

    ctx.body = response.response(initiativeContent);
  });

  router.get('get-user-initiative', '/initiatives/user/:userId', async (ctx: any) => {
    const { userId } = ctx.params;
    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.getUserInitiatives(userId);

    ctx.body = response.response(initiativeContent);
  });

  router.get('get-members', '/initiatives/get/members/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.getMembers(id);

    ctx.body = response.response(initiativeContent);
  });

  router.put('add-members', '/initiatives/set/members/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const { memberId, yearId, memberType } = ctx.request.body;
    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.addMember(id, memberId, yearId, memberType);

    ctx.body = response.response(initiativeContent);
  });

  router.post('join', '/initiatives/join/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const { userId } = ctx.request.body;
    const uuid = userId ?? ctx.state.user.uuid;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.addMember(id, uuid);
    ctx.body = response.response(initiativeContent);
  });

  router.delete('leave', '/initiatives/leave/:id/:userId?', async (ctx: any) => {
    const { id, userId } = ctx.params;
    const uuid = userId ?? ctx.state.user.uuid;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.removeMember(id, uuid);
    ctx.body = response.response(initiativeContent);
  });

  router.put('add-objectives', '/initiatives/set/objective/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const { yearId, objective } = ctx.request.body;
    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const initiativeContent = await initiativeService.addObjective(id, yearId, objective);

    ctx.body = response.response(initiativeContent);
  });

  router.post('add-action', '/initiatives/set/action', async (ctx: any) => {
    const {
      description,
      name,
      userIds,
      initiativeId,
      deadline,
      subActions,
    } = ctx.request.body;

    const initiativeAction = new InitiativeAction();
    initiativeAction.description = description;
    initiativeAction.name = name;
    initiativeAction.users = userIds;
    initiativeAction.initiative = initiativeId;
    initiativeAction.subActions = subActions;
    initiativeAction.deadline = deadline;
    initiativeAction.currentUser = ctx.state.user.uuid;
    await initiativeAction.add();

    ctx.body = response.response(initiativeAction.getResults());
  });

  router.put('update-action', '/initiatives/set/action/:id', async (ctx: any) => {
    const {
      description,
      name,
      userIds,
      initiativeId,
      deadline,
      subActions,
      done,
    } = ctx.request.body;

    const { id } = ctx.params;

    const initiativeAction = new InitiativeAction();
    initiativeAction.uuid = id;
    initiativeAction.description = description;
    initiativeAction.name = name;
    initiativeAction.users = userIds;
    initiativeAction.initiative = initiativeId;
    initiativeAction.subActions = subActions;
    initiativeAction.deadline = deadline;
    initiativeAction.currentUser = ctx.state.user.uuid;
    initiativeAction.done = done;
    await initiativeAction.update();

    ctx.body = response.response(initiativeAction.getResults());
  });

  router.get('get-actions', '/initiatives/get/action/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const initiativeService = new InitiativeService();
    const initiativeContent = await initiativeService.getActions(id);

    ctx.body = response.response(initiativeContent);
  });

  router.get('get-actions', '/initiatives/get/user_action/:id', async (ctx: any) => {
    const { id } = ctx.params;
    const initiativeService = new InitiativeService();
    const initiativeContent = await initiativeService.getUserActions(id);

    ctx.body = response.response(initiativeContent);
  });

  router.delete('delete-action', '/initiatives/delete/action/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const changed = await initiativeService.deleteAction(id);

    ctx.body = response.response(changed);
  });

  router.post('add-meeting', '/initiatives/set/meeting', async (ctx: any) => {
    const {
      name,
      description,
      date,
      time,
      participants,
      initiative,
    } = ctx.request.body;

    const initiativeMeeting = new InitiativeMeeting();
    initiativeMeeting.name = name;
    initiativeMeeting.description = description;
    initiativeMeeting.date = date;
    initiativeMeeting.time = time;
    initiativeMeeting.initiative = initiative;
    initiativeMeeting.currentUser = ctx.state.user.uuid;
    initiativeMeeting.participants = participants;
    await initiativeMeeting.add();

    ctx.body = response.response(initiativeMeeting.getResults());
  });

  router.get('list-meeting', '/initiatives/get/meetings', async (ctx: any) => {
    const {
      id, userId, limit, options,
    } = ctx.request.query;
    const initiativeService = new InitiativeService();
    const meetings = await initiativeService.getMeetings(id, userId, limit, JSON.parse(options));

    ctx.body = response.response(meetings);
  });

  router.get('get-meeting', '/initiatives/get/meeting/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeService = new InitiativeService();
    const meeting = await initiativeService.getMeeting(id);

    ctx.body = response.response(meeting);
  });

  router.put('start-meeting', '/initiatives/start/meeting/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const changed = await initiativeService.startMeeting(id);

    ctx.body = response.response(changed);
  });

  router.put('finish-meeting', '/initiatives/finish/meeting/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const changed = await initiativeService.finishMeeting(id);

    ctx.body = response.response(changed);
  });

  router.put('cancel-meeting', '/initiatives/cancel/meeting/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const changed = await initiativeService.cancelMeeting(id);

    ctx.body = response.response(changed);
  });

  router.delete('delete-meeting', '/initiatives/delete/meeting/:id', async (ctx: any) => {
    const { id } = ctx.params;

    const initiativeService = new InitiativeService();
    initiativeService._currentUser = ctx.state.user.uuid;
    const changed = await initiativeService.deleteMeeting(id);

    ctx.body = response.response(changed);
  });

  return router;
};
