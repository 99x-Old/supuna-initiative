import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import request from 'services/request';
import config from 'config';
import Skeleton from '../Skeleton/SkeletonList';
import Card from '../../Elements/Card';

export default () => {
  const history = useHistory();

  const [initiativeList, setInitiativeList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const listInitiative = useCallback(() => {
    setLoading(true);
    const params = { currentYear: true };
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives`, { params })
      .then((response: ResponseType) => {
        setInitiativeList(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    listInitiative();
  }, [listInitiative]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div>
      {initiativeList.map((initiative: any, index: number) => (
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
    </div>
  );
};
