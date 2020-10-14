import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { StoreType } from '../../types/store.type';

export default ({ children, anonymous }: any) => {
  const auth = useSelector((state: StoreType) => state.auth);

  const isAuth = () => anonymous ?? auth;
  return (
    <>
      {isAuth() ? children : <Redirect to="/" />}
    </>
  );
};
