import React, { Suspense, useCallback, useEffect } from 'react';
import request from 'services/request';
import config from 'config';
import { useHistory } from 'react-router-dom';
import ProfileSkeleton from '../Skeleton';
import Skeleton from '../Skeleton/SkeletonList';
import Card from '../../Elements/Card';

export default () => {
  const history = useHistory();

  const [departmentList, setDepartmentList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const listDepartment = useCallback(() => {
    request.setContentType('application/json');
    setLoading(true);
    request.get(`${config.services.initiative}/departments`)
      .then((response: ResponseType) => {
        setDepartmentList(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    listDepartment();
  }, [listDepartment]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <div>
        {departmentList.map((department: any) => (
          <Card
            width="32%"
            onClick={(e: any) => {
              e.preventDefault();
              history.push(`/manage/create-department/${department.uuid}`);
            }}
            image={false}
            title={department.name}
            description={department.description}
          />
        ))}
      </div>
    </Suspense>
  );
};
