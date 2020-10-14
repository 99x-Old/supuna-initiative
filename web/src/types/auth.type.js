export type AuthType = {
  refresh_token: string,
  token_type: string,
  access_token: string,
  expires_in: string,
  user: {
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    image: string,
    role: [{
      permission: [string],
      role: string
    }]
  }
};

export const AuthDefaults: AuthType = {
  refresh_token: '',
  token_type: '',
  access_token: '',
  expires_in: '',
  user: {
    uuid: '',
    first_name: '',
    last_name: '',
    email: '',
    image: '',
    role: [{
      permission: [''],
      role: '',
    }],
  },
};
