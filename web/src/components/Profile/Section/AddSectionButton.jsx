import React from 'react';
import { Box, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    borderStyle: 'dashed',
    borderColor: theme.palette.secondary.main,
    cursor: 'pointer',
    textAlign: 'center',
  },
}));

export default ({ text, onClick }: PropsType) => {
  const classes = useStyles();

  return (
    <>
      <Box border={1} p={1} borderRadius={2} className={classes.section} onClick={onClick}>
        <Typography noWrap variant="subtitle2">
          { text ?? <div>Add Section</div>}
        </Typography>
      </Box>
    </>
  );
};
