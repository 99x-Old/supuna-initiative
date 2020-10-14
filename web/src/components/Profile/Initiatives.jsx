import React, { useCallback, useEffect } from 'react';
import { Box } from '@material-ui/core';
import config from 'config';
import { useHistory } from 'react-router-dom';
import request from '../../services/request';
import Card from '../Elements/Card';
import SkeletonList from '../Initiative/Skeleton/SkeletonList';

export default ({ userId }: any) => {
  const [initiatives, setInitiatives] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const list = useCallback(() => {
    setLoading(true);
    request.get(`${config.services.initiative}/initiatives/user/${userId}`)
      .then((response: ResponseType) => {
        setInitiatives(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    list();
  }, [list]);

  if (loading) {
    return (<SkeletonList />);
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
    >
      {initiatives.map((initiative: any, index: number) => (
        <Card
          key={index}
          onClick={(e: any) => {
            e.preventDefault();
            history.push(`/initiative/${initiative.uuid}`);
          }}
          image={`${config.services.file}/content/${initiative.uuid}?direct=true`}
          title={initiative.name}
          description={initiative.description}
        />
      ))}
    </Box>

  );
};
