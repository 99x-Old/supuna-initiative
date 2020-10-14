import React, { forwardRef, useImperativeHandle } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default forwardRef((props: any, ref: any) => {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom',
    duration: 5000,
    message: '',
    horizontal: 'right',
  });

  const { vertical, horizontal, open } = state;

  const showAlert = (message: string) => {
    setState({
      ...state,
      open: true,
      message,
    });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useImperativeHandle(ref, () => ({
    showAlert,
  }));

  return (
    <div ref={ref}>
      <Snackbar
        autoHideDuration={state.duration}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={state.message}
        key={vertical + horizontal}
      />
    </div>
  );
});
