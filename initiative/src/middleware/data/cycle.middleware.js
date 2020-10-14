import type { InitiativeType } from 'type/initiative.type';
import InitiativeError from '../../error/initiative.error';

export default () => (cycle: any) => {
  if (!cycle) {
    throw new InitiativeError('Cycle ID not found!');
  }
  const data: InitiativeType = {
    uuid: cycle.uuid,
    title: cycle.title,
    description: cycle.description,
    duration: cycle.duration,
    criteria: cycle?.criteria?.map((criteriaItem: any) => ({
      initiative: criteriaItem.initiative.uuid,
      data: criteriaItem
        .evaluation_criteria
        .map((evaluationCriteria: any) => ({
          points: evaluationCriteria.points,
          note: evaluationCriteria.note,
          criteria: evaluationCriteria.criteria,
        })),
    })),
    contributors: cycle.contributors.map((contributor: {}) => ({
      initiative: contributor.initiative.uuid,
      users: contributor.contributors.map((userItem: any) => ({
        user: userItem.user,
        feedback: userItem.feedback,
      })),
    })),
    created_at: cycle.created_at,
    done: cycle.done,
  };
  return data;
};
