import React, { useCallback, useEffect, useRef } from 'react';
import type { ReferenceType } from 'types/html.type';
import request from 'services/request';
import config from 'config';
import type { ProfileType } from 'types/profile.type';
import { Chip } from '@material-ui/core';
import UserManager from './Manager';
import SearchInput from '../Input';
import UserItem from './UserItem';
import SkeletonUsers from '../Skeleton/SkeletonUsers';

export default () => {
  const managerRef: ReferenceType = useRef(null);

  const [results, setResults] = React.useState({
    list: [],
    total: 0,
    limit: 0,
    offset: 0,
    page: 0,
    pages: 0,

  });
  const [roles, setRoles] = React.useState([{}]);
  const [searchParams] = React.useState({
    q: '',
    filters: {},
    limit: 5,
    page: 1,

  });
  const [loading, setLoading] = React.useState(true);

  const search = useCallback(() => {
    setLoading(true);
    request.get(`${config.services.user}/users`, { searchParams })
      .then((response: ResponseType) => {
        setResults(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, [searchParams]);
  const getRoles = useCallback(() => {
    request.get(`${config.services.user}/role`, { searchParams })
      .then((response: ResponseType) => {
        setRoles(response.body);
      });
  }, [searchParams]);

  useEffect(() => {
    search();
    getRoles();
  }, [getRoles, search]);

  if (loading) {
    return <SkeletonUsers />;
  }

  return (
    <div>
      <SearchInput
        onChange={() => {
        }}
      />
      <UserManager ref={managerRef} roles={roles} onClose={search} />
      {results.list.map((user: ProfileType, index: number) => (
        <UserItem
          onClick={(selectedUser: ProfileType) => { managerRef.current.open(selectedUser); }}
          key={index}
          user={user}
          subItem={user.role.map((role: any) => <Chip label={role.role} />)}
        />
      ))}
    </div>
  );
};
