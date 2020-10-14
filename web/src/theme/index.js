import { createMuiTheme } from '@material-ui/core/styles';
import Light from './light';
import Dark from './dark';
import option from './options';

export default (type: string) => {
  const theme = type === 'dark' ? Dark : Light;

  let muiTheme = createMuiTheme(theme);
  muiTheme = option(muiTheme);
  return muiTheme;
};
