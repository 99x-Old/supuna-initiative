import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import {
  Box,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import request from 'services/request';
import config from 'config';
import type { ReferenceType } from 'types/html.type';
import Button from '../../Elements/Button';
import Editor from '../../Editor';

export default forwardRef((props: PropsType, ref: any) => {
  const titleRef: ReferenceType = useRef(null);
  const descriptionRef: ReferenceType = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [duration, setDuration]: any = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 2, 31),
  });

  const handleFromChange = (date: Date) => {
    setDuration((currentDuration: any) => ({ ...currentDuration, ...{ from: date } }));
  };
  const handleToChange = (date: Date) => {
    setDuration((currentDuration: any) => ({ ...currentDuration, ...{ to: date } }));
  };

  const create = useCallback(() => {
    setLoading(true);
    const title = titleRef.current.getRawContents();
    const description = descriptionRef.current.getContents();

    request.setContentType('application/json');
    request.post(`${config.services.initiative}/initiative-review-cycle`, {
      title, duration, description,
    })
      .then(() => {
        setOpen(false);
      }).finally(() => {
        setLoading(false);
      });
  }, [duration]);

  const openCreate = () => {
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    openCreate,
  }));
  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle><Typography component="div" variant="subtitle1">Create a Cycle</Typography></DialogTitle>
        <DialogContent>
          <Box>
            <Box mb={1}>
              <Editor
                ref={titleRef}
                className="hide"
                placeholder="Title"
              />
            </Box>
          </Box>
          <Box>
            <Box mb={1}>
              <Editor
                ref={descriptionRef}
                height="50px"
                className="hide"
                placeholder="Description"
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box mb={1}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="none"
                  format="yyyy/MM/dd"
                  value={duration.from}
                  onChange={handleFromChange}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="none"
                  format="yyyy/MM/dd"
                  value={duration.to}
                  onChange={handleToChange}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Box>
        </DialogContent>
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
          <Button onClick={create} color="primary" loading={loading} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
