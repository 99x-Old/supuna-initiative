import React, { Suspense, useCallback, useEffect } from 'react';
import request from 'services/request';
import config from 'config';
import { useHistory } from 'react-router-dom';
import ProfileSkeleton from '../Skeleton';
import Skeleton from '../Skeleton/SkeletonList';
import Card from '../../Elements/Card';

export default () => {
  const history = useHistory();

  const [initiativeList, setInitiativeList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const listInitiative = useCallback(() => {
    request.setContentType('application/json');
    setLoading(true);
    request.get(`${config.services.initiative}/initiatives`)
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
    <Suspense fallback={<ProfileSkeleton />}>
      <div>
        {initiativeList.map((initiative: any) => (
          <Card
            onClick={(e: any) => {
              e.preventDefault();
              history.push(`/manage/create-initiative/${initiative.uuid}`);
            }}
            image={`${config.services.file}/content/${initiative.uuid}?direct=true`}
            title={initiative.name}
            description={initiative.description}
          />
        ))}
      </div>
    </Suspense>
  );
};
