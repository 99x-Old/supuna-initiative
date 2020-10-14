import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import request from 'services/request';
import config from 'config';
import Skeleton from '../Skeleton/SkeletonList';
import Card from '../../Elements/Card';

export default () => {
  const history = useHistory();
  const [initiativeYearList, setInitiativeYearList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const listInitiative = useCallback(() => {
    setLoading(true);
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiative-years`)
      .then((response: ResponseType) => {
        setInitiativeYearList(response.body);
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
      {initiativeYearList.map((initiativeYear: any, index: number) => (
        <Card
          key={index}
          onClick={(e: any) => {
            e.preventDefault();
            history.push(`/manage/create-initiative-year/${initiativeYear.uuid}`);
          }}
          image={`${config.services.file}/content/${initiativeYear.uuid}?direct=true`}
          title={initiativeYear.name}
          description={initiativeYear.description}
        />
      ))}
    </div>
  );
};
