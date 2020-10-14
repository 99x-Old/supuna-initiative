import { Box, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import type { PropsType } from '../../types/react.type';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    border: `1px dashed ${theme.palette.secondary.main}`,
    color: `${theme.palette.secondary.dark}`,
    width: '50%',
    textAlign: 'center',
  },
}));

export default ({ label }: PropsType) => {
  const classes = useStyles();

  return <Box p={1} className={classes.content}><Typography variant="subtitle2">{label}</Typography></Box>;
};
