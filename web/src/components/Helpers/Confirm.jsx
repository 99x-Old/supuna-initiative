import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  DialogActions, Dialog, DialogContent, DialogTitle,
} from '@material-ui/core';
import { Button, TextField } from 'components/Elements';
import Typography from '@material-ui/core/Typography';
import type { PropsType } from 'types/react.type';
import type { InputType } from 'types/html.type';

export default forwardRef((props: PropsType, ref: any) => {
  const [note, setNote] = useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [options, setOptions] = React.useState({
    title: '',
    model: '',
    confirmText: '',
  });
  const [callback, setCallback] = React.useState(null);

  useImperativeHandle(ref, () => ({
    open(action: string, option: any, returnBack: ()=>{}) {
      setOpen(action);
      setOptions(option);
      setCallback(returnBack);
    },
  }));

  const confirm = () => {
    setOpen(false);
    callback(note).then(() => setLoading(false));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle><Typography variant="body2">{options.title}</Typography></DialogTitle>
      {options.model === 'follow' && (
      <DialogContent>
        {props.children}
        <TextField
          onChange={(e: InputType) => setNote(e.target.value)}
          placeholder="Note..."
          multiline
          rows={2}
          rowsMax={5}
        />
      </DialogContent>
      )}
      <DialogActions>
        <Button
          autoFocus
          color="primary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={confirm} color="primary" loading={loading}>
          {options.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
