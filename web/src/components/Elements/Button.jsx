import React from 'react';
import Button from '@material-ui/core/Button';
import DotSpinner from 'components/Loader/Dot';

type PropsType = {
  loading: boolean,
  children: any
};

export default (props: PropsType) => {
  const { loading, children } = props;

  let customizedProps = { ...props };
  delete customizedProps.loading;

  if (loading) {
    customizedProps = { ...customizedProps, disabled: true };
  }

  return (
    <Button {...customizedProps}>
      {loading ? <DotSpinner /> : children}
    </Button>
  );
};
