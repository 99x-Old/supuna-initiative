import 'fontsource-open-sans';
import { fade } from '@material-ui/core';

const defaultColor = '#f47e47';
const defaultColorLight = '#f47e47a1';
const defaultTextColor = '#ffffff';
const defaultBackgroundColor = '#e9eef1';
const defaultBackgroundTextColor = '#36393f';
const defaultBorderColor = '#e6e6e6';

export default {
  typography: {
    fontFamily: '"Open Sans"',
  },
  palette: {
    type: 'light',
    primary: {
      main: defaultColor,
      contrastText: defaultTextColor,
      light: defaultColorLight,
    },
    secondary: {
      main: '#e0e0e0',
      contrastText: defaultBackgroundTextColor,
      light: defaultTextColor,
      borderColor: defaultBorderColor,
    },
    error: {
      main: '#d70000',
      contrastText: defaultBackgroundTextColor,
    },
    background: {
      default: defaultTextColor,
      paper: defaultBackgroundColor,
    },
  },
  overrides: {
    MuiFormLabel: {
      root: {
        color: defaultBackgroundTextColor,
      },
    },
    MuiFormControl: {
      root: {
        background: defaultTextColor,
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '3px',
        border: `1px solid ${defaultColor}`,
      },
    },
    MuiSelect: {
      select: {
        background: 'white',
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '3px',
      },
    },
    MuiInputBase: {
      input: {
        margin: 0,
        padding: '10px !important',
        borderRadius: '3px',
      },
    },
    MuiInput: {
      underline: {
        '&&&&:before': {
          borderBottom: 'none',
        },
        '&&&&:focus': {
          borderBottom: 'none',
        },
      },
    },
    MuiTextField: {
      root: {
        color: defaultBackgroundTextColor,
        border: `1px solid ${defaultBorderColor}`,
      },
    },
    MuiPaper: {
      root: {
        color: defaultBackgroundTextColor,
        border: `1px solid ${defaultBorderColor}`,
      },
    },
    MuiGridListTileBar: {
      root: {
        background: fade(defaultColor, 0.5),
      },
    },
    MuiPopover: {
      root: {
        zIndex: '1302 !important',
      },
    },
  },
  shadows: Array(25).fill('none'),
};
