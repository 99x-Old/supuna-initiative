import type { ServiceIdType } from '../types/service-id.type';

export const extractServiceId: ServiceIdType | boolean = (serviceId) => {
  if (!serviceId) {
    return false;
  }

  const services = ['auth', 'user', 'location', 'file', 'content'];
  const splitString = serviceId.split(':');

  if (splitString.length !== 3) {
    return false;
  }

  if (!services.includes(splitString[0])) {
    return false;
  }

  return {
    service: splitString[0],
    field: splitString[1],
    id: splitString[2],
  };
};

export default {};
