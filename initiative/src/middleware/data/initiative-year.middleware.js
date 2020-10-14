import type { InitiativeYearType, InitiativeType } from 'type/initiative.type';
import InitiativeError from 'error/initiative.error';

export default () => (initiative: any) => {
  if (!initiative) {
    throw new InitiativeError('Year ID not found!');
  }

  const data: InitiativeYearType = {
    uuid: initiative.uuid,
    name: initiative.name,
    description: initiative.description,
    duration: initiative.duration,
    created_at: initiative.created_at,
    evaluationCriteria: initiative?.evaluation_criteria?.map((criteria: any) => ({
      id: criteria._id, criteria: criteria.criteria, weight: criteria.weight,
    })),
    initiatives: initiative?.initiatives?.map((initiativeItem: InitiativeType) => ({
      uuid: initiativeItem.uuid,
      name: initiativeItem.name,
      description: initiativeItem.description,
      created_at: initiativeItem.created_at,
      members: initiativeItem.members.map((memberItem: {}) => ({
        user: memberItem.user,
        type: memberItem.type.type,
      })),
      objective: initiativeItem?.objectives?.objective,
    })),

  };
  return data;
};
