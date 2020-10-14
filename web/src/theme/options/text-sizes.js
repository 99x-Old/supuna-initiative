import { Theme } from '@material-ui/core';

export default (theme: Theme) => {
  const changeTheme = theme;
  changeTheme.typography.caption = {
    fontSize: '1rem',
    margin: '0 !important',
    lineHeight: '1',
  };
  return changeTheme;
};
