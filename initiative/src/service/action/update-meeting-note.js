import InitiativeService from '../initiative.service';

export default (data: any) => {
  const initiativeService = new InitiativeService();

  initiativeService
    .updateMeetingNotes(data.body.meetingId, data.body.notes)
    .then();
};
