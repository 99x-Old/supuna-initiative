export type UserType = {
  uuid: string,
  first_name: string,
  last_name: string,
  email: string,
  bio: string,
  birth: string,
  mobile: string,
  gender: string,
  status: boolean,
  files?: any
};
export type UserMiniType = {
  id: string,
  uuid: string,
  first_name: string,
  last_name: string,
  status: boolean,
  email: string
};
