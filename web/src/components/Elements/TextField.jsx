import React from 'react';
import { TextField } from '@material-ui/core';
import DotSpinner from 'components/Loader/Dot';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  halfNakedInput: {
    border: 'none !important',
  },
}));
type PropsType = {
  loading: boolean
};

export default (props: PropsType) => {
  const { loading } = props;
  const classes = useStyles();

  let customizedProps = { ...props };
  delete customizedProps.loading;

  if (loading) {
    customizedProps = { ...customizedProps, disabled: true };
  }

  return (
    <>
      {loading ? <DotSpinner />
        : <TextField {...customizedProps} className={classes.halfNakedInput} />}
    </>
  );
};
