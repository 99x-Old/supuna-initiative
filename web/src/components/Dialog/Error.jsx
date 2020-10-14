import React, { useState } from 'react';
import Button from 'components/Elements/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

export default (props: any) => {
  const {
    show, message, buttonOk, children,
  } = props;
  const [error, setError] = useState(show);

  const closeError = () => {
    setError(false);
  };

  const clickOk = () => {
    setError(false);
    props.ok();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      disableBackdropClick
      open={error}
      onClose={closeError}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="form-dialog-title">Authentication</DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        <Typography>
          <div>{message}</div>
          <br />
          {children}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={clickOk}>
          {buttonOk}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
