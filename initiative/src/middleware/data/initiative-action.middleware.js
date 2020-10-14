import type { InitiativeActionType } from 'type/initiative.type';
import InitiativeError from 'error/initiative.error';

export default () => (action: any) => {
  if (!action) {
    throw new InitiativeError('Action not found!');
  }
  const data: InitiativeActionType = {
    createdAt: action.created_at,
    deadline: action.deadline,
    description: action.description,
    initiative: action.initiative,
    name: action.name,
    users: action.users,
    uuid: action.uuid,
    year: action.year,
    subActions: action.sub_actions,
    done: action.done,
  };
  return data;
};
