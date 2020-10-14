import 'fontsource-open-sans';
import { fade } from '@material-ui/core';

const defaultColor = '#2f3136';
const defaultColorLight = '#36393f';
const defaultTextColor = '#ffffff';
const defaultBackgroundTextColor = '#ffffff';
const defaultLightColor = '#585a5e';
const defaultBorderColor = defaultLightColor;

export default {
  typography: {
    fontFamily: '"Segoe UI","Open Sans"',
  },
  palette: {
    type: 'dark',
    background: {
      default: defaultColorLight,
      paper: defaultColor,
    },
    primary: {
      main: defaultLightColor,
      contrastText: defaultTextColor,
      light: defaultColorLight,
    },
    secondary: {
      main: defaultColor,
      contrastText: defaultBackgroundTextColor,
      borderColor: defaultBorderColor,
    },
    error: {
      main: '#d70000',
      contrastText: defaultBackgroundTextColor,
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
        background: defaultLightColor,
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '3px',
        border: `1px solid ${defaultColor}`,
      },
    },
    MuiSelect: {
      select: {
        background: defaultTextColor,
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
        color: defaultTextColor,
        backgroundColor: '#585a5e',
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
