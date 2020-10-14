import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Grid } from '@material-ui/core';
import config from 'config';
import type { PropsType } from 'types/react.type';
import request from 'services/request';
import { Button } from '../../Elements';
import MeetingMange from './Elements/ManageMeeting';
import ViewMeeting from './Elements/ViewMeeting';
import MeetingItem from './Elements/MeetingItem';
import Guard from '../../Sytem/Guard';
import SkeletonAny from '../Skeleton/SkeletonAny';
import Empty from '../../Elements/Empty';

export default ({
  initiativeId, userId, limit, onlyMeetings, upComing,
}: PropsType) => {
  const [meetings, setMeetings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const manageRef: any = useRef(null);
  const viewRef: any = useRef(null);

  const handleActionMange = (meetingData: any) => {
    manageRef.current.open(meetingData);
  };

  const getMeetings = useCallback(() => {
    setLoading(true);

    request.setContentType('application/json');
    const options = { upComing: upComing ?? false };
    const params = {
      id: initiativeId, userId, limit, options,
    };
    request.get(`${config.services.initiative}/initiatives/get/meetings`, { params })
      .then((response: ResponseType) => {
        setMeetings(response.body);
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [initiativeId, limit, upComing, userId]);

  const viewMeeting = (meetingData: any) => {
    viewRef.current.open(meetingData);
  };

  useEffect(() => {
    getMeetings();
  }, [getMeetings]);

  if (loading) {
    return <SkeletonAny />;
  }

  return (
    <Box>
      <MeetingMange ref={manageRef} initiativeId={initiativeId} reload={getMeetings} />
      <ViewMeeting ref={viewRef} reload={getMeetings} />
      {!onlyMeetings && (
      <Guard requiredPermission="set-initiative-meeting">
        <Button color="primary" variant="contained" onClick={handleActionMange}>Create a meeting</Button>
      </Guard>
      )}
      <Box mb={1} />
      <Grid container spacing={1}>
        {meetings.map((meeting: any, index: number) => (
          <Grid item md={6} key={index}>
            <Box>
              <MeetingItem
                meeting={meeting}
                key={index}
                onClickJoin={viewMeeting}
                reload={getMeetings}
              />
            </Box>
          </Grid>
        ))}
        {!meetings.length && <Empty label="No Meetings" />}
      </Grid>
    </Box>
  );
};
