import MeetingNoteAction from './actions/meeting-note.action';
import StatusAction from './actions/status.action';
import FeedAction from './actions/feed.action';

class SocketService {
  constructor(io: any) {
    this.server = io;
  }

  listen() {
    MeetingNoteAction(this.server);
    StatusAction(this.server);
    FeedAction(this.server);
  }
}
export default SocketService;
