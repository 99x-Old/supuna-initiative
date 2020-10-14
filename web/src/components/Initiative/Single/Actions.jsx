import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Box, Grid } from '@material-ui/core';
import type { PropsType } from 'types/react.type';
import { Button } from 'components/Elements';
import request from 'services/request';
import config from 'config';
import type { ReferenceType } from 'types/html.type';
import type { ActionType } from 'types/action.type';
import ManageAction from './Elements/ManageAction';
import ActionItem from './Elements/ActionItem';
import Guard from '../../Sytem/Guard';
import SkeletonAny from '../Skeleton/SkeletonAny';

export default ({ initiativeId, location }: PropsType) => {
  const manageUserRef: ReferenceType = useRef(null);

  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);

  const getActions = useCallback(() => {
    setLoading(true);
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives/get/action/${initiativeId}`)
      .then((response: ResponseType) => {
        setActions(response.body);
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [initiativeId]);

  const handleClickOpen = () => {
    manageUserRef.current.open(true);
  };
  const handleActionMange = (actionData: any) => {
    manageUserRef.current.open(actionData);
  };

  useEffect(() => {
    getActions();
  }, [getActions]);

  useEffect(() => {
    const actionId = new URLSearchParams(location.search).get('id');
    const actionData = actions.find((actionItem: ActionType) => actionItem
      .uuid === actionId);

    if (actionData && manageUserRef.current) {
      manageUserRef
        .current
        .open(actionData);
    }
  }, [actions, location.search]);

  return (
    <Box>
      <ManageAction ref={manageUserRef} initiativeId={initiativeId} onSaved={getActions} />
      {loading ? <SkeletonAny /> : (
        <>
          <Guard requiredPermission="add-initiative-action">
            <Button color="primary" variant="contained" onClick={handleClickOpen}>Create an action</Button>
          </Guard>
          <Box mb={1} />

          <Grid container spacing={1}>
            {actions.map((action: any, index: number) => (
              <Grid item md={4} key={index}>
                <ActionItem action={action} handleMange={handleActionMange} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};
