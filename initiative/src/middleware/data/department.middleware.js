import type { InitiativeType } from 'type/initiative.type';

export default () => (department: any) => {
  const data: InitiativeType = {
    id: department._id,
    name: department.name,
    description: department.description,
    created_at: department.created_at,
  };
  return data;
};
