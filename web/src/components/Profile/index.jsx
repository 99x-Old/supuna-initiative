import React, { lazy, Suspense, useEffect } from 'react';
import './Profile.scss';
import Grid from '@material-ui/core/Grid';
import UserService from 'services/user';
import { setProfile } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import type { StoreType } from 'types/store.type';
import SkeletonAny from '../Initiative/Skeleton/SkeletonAny';

const ProfileTabs = lazy(() => import('./ProfileTabs'));
const ProfileCard = lazy(() => import('./ProfileCard'));
const LeftCard = lazy(() => import('./LeftCard'));

const userService = new UserService();

type PropsType = {
  match: { params: { tab: string, id: string } }
};

export default (props: PropsType) => {
  const { match }: any = props;

  const dispatch = useDispatch();
  const auth = useSelector((state: StoreType) => state.auth);
  const profile = useSelector((state: StoreType) => state.profile);

  const [sameUser, setSameUser] = React.useState(false);
  const currentUserId = match.params.id ?? auth?.user.uuid;

  useEffect(() => {
    if (currentUserId) {
      userService.getProfile(currentUserId)
        .then((response: ResponseType) => dispatch(setProfile(response.body)));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    setSameUser(auth && auth.user.uuid === currentUserId);
  }, [auth, currentUserId]);

  return (
    <Suspense fallback={<SkeletonAny />}>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <ProfileCard sameUser={sameUser} />
          <LeftCard />
        </Grid>
        <Grid item md={9}>
          <div>
            <Grid item xs={12}>
              <ProfileTabs tab={match.params.tab} profile={profile} sameUser={sameUser} />
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={4} />
      </Grid>
    </Suspense>
  );
};
