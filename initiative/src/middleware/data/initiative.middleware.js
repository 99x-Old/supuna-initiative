import type { InitiativeType } from 'type/initiative.type';
import InitiativeError from '../../error/initiative.error';

export default () => (initiative: any) => {
  if (!initiative) {
    throw new InitiativeError('Initiatives ID not found!');
  }
  const data: InitiativeType = {
    uuid: initiative.uuid,
    name: initiative.name,
    description: initiative.description,
    objectives: initiative.objectives,
    members: initiative?.members?.map((member: any) => member.user),
    created_at: initiative.created_at,
  };
  return data;
};
