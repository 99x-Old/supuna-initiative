import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { InputLabel, Slider, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Confirm from 'components/Elements/Confirm';
import { Button } from 'components/Elements';
import type { InputType, ReferenceType } from 'types/html.type';
import Editor from '../../../Editor';

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    color: theme.palette.secondary.contrastText,
    marginBottom: '10px',
    marginTop: '1rem',
  },
}));
type PropsType = {
    onClose: any,
    onAdd: any
};
export default forwardRef(({ onClose, onAdd }: PropsType, ref: any) => {
  const classes = useStyles();
  const confirmRef: ReferenceType = useRef(null);
  const criteriaRef: ReferenceType = useRef(null);

  const [open, setOpen] = React.useState(false);
  const [loading] = React.useState(false);
  const [criteria, setCriteria] = React.useState({
    criteria: '',
    weight: 0,
  });

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose(true);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const add = () => {
    const criteriaText = criteriaRef.current.getRawContents();

    if (onAdd && criteriaText.length) {
      onAdd({ ...criteria, criteria: criteriaText });
    }
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    open: handleClickOpen,
  }));

  return (
    <div>
      <Confirm ref={confirmRef} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Evaluation Criteria</DialogTitle>
        <DialogContent className={classes.content}>
          <InputLabel className={classes.label}>Criteria</InputLabel>
          <Editor placeholder="Note..." ref={criteriaRef} height="100px" toolbarHidden />
          <InputLabel className={classes.label}>Weight</InputLabel>
          <Slider
            defaultValue={0}
            value={criteria.weight}
            step={5}
            marks
            min={0}
            max={100}
            valueLabelDisplay="auto"
            onChange={(e: InputType, weight: number) => {
              setCriteria((currentCriteria: any) => ({ ...currentCriteria, weight }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">Close</Button>
          <Button color="primary" loading={loading} onClick={add}>Add</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
});
