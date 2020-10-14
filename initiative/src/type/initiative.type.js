export type InitiativeYearType = {
  uuid: string,
  name: string,
  description: string,
  created_at: string
};
export type InitiativeType = {
  uuid: string,
  name: string,
  description: string,
  created_at: string,
  members: [{
    user: string,
    type: {
      type: string,
      note: string
    },
    added_by: string
  }],
  objectives: {
    objective: string
  }
};
export type InitiativeActionType = {
  createdAt: string,
  deadline: string,
  description: string,
  initiative: string,
  name: string,
  users: string[],
  uuid: string,
  year: string,
  done: boolean
};
