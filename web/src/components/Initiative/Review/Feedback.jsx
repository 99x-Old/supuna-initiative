import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Button from 'components/Elements/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import type { ReferenceType } from 'types/html.type';
import type { PropsType } from 'types/react.type';
import Editor from '../../Editor';

export default forwardRef(({ onClickAdd, onClickRemove }: PropsType, ref: any) => {
  const commentRef: ReferenceType = useRef('');
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [currentContributor, setCurrentContributor] = React.useState(null);

  const handleOpen = (action: boolean, userId: string, contributor: any = null) => {
    setOpen(action);
    setId(userId);
    setCurrentContributor(contributor);
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        <Editor
          ref={commentRef}
          height="50px"
          className="hide"
          placeholder="Note/Comments..."
        />
      </DialogContent>
      <DialogActions>
        {currentContributor && (
        <Button
          color="primary"
          onClick={() => {
            onClickRemove(currentContributor);
            setOpen(false);
          }}
        >
          Remove
        </Button>
        )}
        <Button
          color="primary"
          onClick={() => {
            onClickAdd(commentRef.current.getRawContents(), id);
            setOpen(false);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
});
