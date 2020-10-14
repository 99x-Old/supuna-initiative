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
  }]
};
