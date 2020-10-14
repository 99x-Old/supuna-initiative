import React, { useEffect, useRef, useState } from 'react';
import Snackbar from 'components/Shared/Snackbar';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import type { PropsType } from 'types/react.type';
import type { StoreType } from 'types/store.type';
import type { ReferenceType } from 'types/html.type';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../../theme';

export default (props: PropsType) => {
  const [, setError] = useState(null);
  const [mode, setMode] = useState('light');

  const { children } = props;
  const errorStore = useSelector((state: StoreType) => state.error);
  const popupStore = useSelector((state: StoreType) => state.popup);
  const snackRef: ReferenceType = useRef();

  const settings = useSelector((state: StoreType) => state.settings);

  useEffect(() => {
    if (!_.isEmpty(errorStore)) {
      setError(errorStore);
      snackRef.current.show(errorStore.message, { variant: 'error' });
    }
  }, [errorStore]);

  useEffect(() => {
    if (!_.isEmpty(popupStore)) {
      snackRef.current.show(popupStore.message, { variant: popupStore.type });
    }
  }, [errorStore, popupStore]);

  useEffect(() => {
    setMode(settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  return (
    <>
      <ThemeProvider theme={theme(mode)}>
        <CssBaseline />
        <Snackbar ref={snackRef} />
        {children}
      </ThemeProvider>
    </>
  );
};
