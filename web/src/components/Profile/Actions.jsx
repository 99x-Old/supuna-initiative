import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import type { PropsType } from 'types/react.type';
import request from 'services/request';
import config from 'config';
import { useHistory } from 'react-router-dom';
import SkeletonAny from '../Initiative/Skeleton/SkeletonAny';
import ActionItem from '../Initiative/Single/Elements/ActionItem';

export default ({ userId }: PropsType) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);

  const getActions = useCallback(() => {
    setLoading(true);
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives/get/user_action/${userId}`)
      .then((response: ResponseType) => {
        setActions(response.body);
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleActionMange = (actionData: any) => {
    history.push(`/initiative/${actionData.initiative}/actions/?id=${actionData.uuid}`);
  };

  useEffect(() => {
    getActions();
  }, [getActions]);

  if (loading) {
    return <SkeletonAny />;
  }

  return (
    <Box>
      <Grid container spacing={1}>
        {actions.map((action: any, index: number) => (
          <Grid item md={4} key={index}>
            <ActionItem action={action} handleMange={handleActionMange} />
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};
