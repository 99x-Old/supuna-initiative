export type ProfileType = {
  uuid: string,
  first_name: string,
  last_name: string,
  email: string,
  bio: string,
  birth: string,
  mobile: string,
  gender: string,
  status: string,
  profile_image?: string,
  role?: []
};

export const ProfileDefaults: ProfileType = {
  uuid: '',
  first_name: '',
  last_name: '',
  email: '',
  bio: '',
  birth: '',
  mobile: '',
  country: '',
  city: '',
  gender: '',
  connections: [],
  profile_image: null,
  files: {},
};

export type SectionContentType = {
  id?: string,
  name?: string,
  title: {
    text: string,
    readonly: boolean
  },
  tags: string[] | null,
  text: string,
  position: {
    column: number,
    index: number
  }
};
export type SectionTitleType = {
  name: string
};
