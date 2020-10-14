import React, { useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
import type { PropsType } from '../../../types/react.type';
import request from '../../../services/request';
import config from '../../../config';
import type { ResponseType } from '../../../types/response.type';
import Viewer from '../../Elements/Viewer';
import { Button } from '../../Elements';
import ReviewInitiativeItem from './ReviewInitiativeItem';
import SkeletonAny from '../Skeleton/SkeletonAny';

export default ({ cycleId }: PropsType) => {
  const [loading, setLoading] = React.useState(false);
  const [year, setYear] = React.useState(null);
  const [cycle, setCycle] = React.useState(null);

  const getCurrentYear = () => {
    setLoading(true);
    request.get(`${config.services.initiative}/initiative-years/get/current`)
      .then((response: ResponseType) => {
        setYear(response.body);
      }).finally(() => {
        setLoading(false);
      });
  };
  const finish = () => {
    setLoading(true);
    request.setContentType('application/json');
    request.post(`${config.services.initiative}/initiative-review-cycle/publish/initiative/${cycle.uuid}`)
      .then((response: any) => {
        setCycle(response.body);
      }).finally(() => {
        setLoading(false);
      });
  };

  const getCycle = (id: string) => {
    setLoading(true);
    request.get(`${config.services.initiative}/initiative-review-cycle/${id}`)
      .then((response: ResponseType) => {
        setCycle(response.body);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCurrentYear();
    getCycle(cycleId);
  }, [cycleId]);

  if (loading) {
    return <SkeletonAny />;
  }

  return (
    <div>
      {year && cycle && (
        <Box>
          <Typography variant="h5" component="div">
            <Viewer escapeHtml={false} source={year.name} />
          </Typography>
          {year.initiatives.map((initiative: any, index: number) => (
            <ReviewInitiativeItem
              key={index}
              initiative={initiative}
              cycle={cycleId}
              criteriaData={cycle.criteria
                .find((criteriaItem: any) => criteriaItem.initiative === initiative.uuid)}
              contributorsData={cycle.contributors
                .find((contributorItem: any) => contributorItem.initiative === initiative.uuid)}
              evaluationCriteria={year.evaluationCriteria}
            />
          ))}
          <Box mb={1} flexDirection="row-reverse" display="flex">
            {!cycle.done
                        && (
                        <Button variant="contained" color="primary" loading={loading} onClick={finish}>
                          Finish and
                          Publish
                        </Button>
                        )}
          </Box>
        </Box>
      )}
    </div>
  );
};
