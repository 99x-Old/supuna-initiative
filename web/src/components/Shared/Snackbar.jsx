import React, {
  forwardRef, useImperativeHandle, useRef, useState,
} from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import type { ReferenceType } from 'types/html.type';
import type { PropsType } from 'types/react.type';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  closeIcon: {
    padding: 4,
    display: 'inline-block',
    color: 'white',
  },
}));

const Snackbar = forwardRef((props: PropsType, ref: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [defaultOptions] = useState({
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    variant: 'info',
  });

  useImperativeHandle(ref, () => ({
    show(message: string, options: {}) {
      enqueueSnackbar(message, { ...defaultOptions, ...options } ?? defaultOptions);
    },
  }));
  return null;
});

export default forwardRef((props: PropsType, ref: any) => {
  const classes = useStyles();

  const snackRef: ReferenceType = useRef();
  const snackProviderRef: ReferenceType = useRef();

  const getStripedValue = (text: string) => text.replace(/<[^>]*>?/gm, '');

  useImperativeHandle(ref, () => ({
    show(message: string, options: {}) {
      snackRef.current.show(getStripedValue(message), options);
    },
  }));
  const onClickDismiss = (key: number) => () => {
    snackProviderRef.current.closeSnackbar(key);
  };
  return (
    <SnackbarProvider
      hideIconVariant
      ref={snackProviderRef}
      maxSnack={3}
      action={(key: number) => (
        <IconButton onClick={onClickDismiss(key)} className={classes.closeIcon}>
          <CloseIcon />
        </IconButton>
      )}
    >
      <Snackbar ref={snackRef} />
    </SnackbarProvider>
  );
});
