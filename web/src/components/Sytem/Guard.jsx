import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { StoreType } from 'types/store.type';
import type { PropsType } from 'types/react.type';

export default ({ requiredPermission, requiredRole, children }: PropsType) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [canAccess, setCanAccess] = useState(false);

  const auth = useSelector((state: StoreType) => state?.auth?.user);

  useEffect(() => {
    if (auth) {
      setRoles(auth.role.map((role: any) => role.role));
      setPermissions(auth.role.map((role: any) => role.permission).flat());
    }
  }, [auth]);

  const isInclude = (parent: [], child: [], full: boolean = false) => {
    let returnValue = !!full;
    child.forEach((item: string) => {
      if (full) {
        if (!parent.includes(item)) {
          returnValue = false;
        }
      } else if (parent.includes(item)) {
        returnValue = true;
      }
    });
    return returnValue;
  };

  useEffect(() => {
    if (permissions.includes(requiredPermission)
        || isInclude(roles, requiredRole ?? [])
        || roles.includes('super-admin')) {
      setCanAccess(true);
    }
  }, [permissions, requiredPermission, requiredRole, roles]);

  return (
    <>
      {canAccess && children}
    </>
  );
};
