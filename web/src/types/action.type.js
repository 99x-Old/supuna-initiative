export type ActionType = {
  uuid: string,
  name: string,
  description: string,
  deadline: string,
  addedBy: string,
  subActions: [{
    value: string,
    done: boolean
  }],
  created_at: string
};
