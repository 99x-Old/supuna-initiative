import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Switch, { Case } from 'components/Helpers/Switch';
import Error from 'components/Dialog/Error';
import Login from 'components/Login';
import { useSelector } from 'react-redux';
import type { StoreType } from 'types/store.type';

export default () => {
  const [hash, setHash] = useState();
  const history = useHistory();
  const auth = useSelector((state: StoreType) => state.auth);

  window.addEventListener('hashchange', () => {
    setHash(history.location.hash);
  });

  useEffect(() => {
    setHash(history.location.hash);
  }, [history]);

  return (
    <div>
      <Switch condition={hash}>
        <Case value="#auth-fail">
          {!auth && (
          <Error
            ok={history.push('/')}
            show
            buttonOk={false}
            message="You have been logged out!"
          >
            <Login />
          </Error>
          )}
        </Case>
      </Switch>
    </div>
  );
};
