import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Confirm from 'components/Elements/Confirm';
import request from 'services/request';
import config from 'config';
import { Button } from 'components/Elements';
import type { InputType, ReferenceType } from 'types/html.type';
import UserService from 'services/user';
import Rating from '@material-ui/lab/Rating';
import { Scrollbars } from 'react-custom-scrollbars';
import Kudos from '../../Kudos';
import Snackbar from '../../../Shared/Snackbar';
import Editor from '../../../Editor';

const userService = new UserService();

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(23),
    height: theme.spacing(30),
  },
  content: {
    overflow: 'hidden',
  },
  reviewStars: {
    verticalAlign: 'middle',
  },
}));

type PropsType = {
    onClose: any,
    initiativeId: any,
    onKick: any
};
export default forwardRef(({ onClose, onKick, initiativeId }: PropsType, ref: any) => {
  const [rate, setRate] = React.useState(2);
  const [hover, setHover] = React.useState(-1);
  const [currentRating, setCurrentRating] = React.useState(0);
  const [overallRating, setOverallRating] = React.useState(0);
  const [reviews, setReviews] = React.useState([]);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const confirmRef: ReferenceType = useRef(null);
  const kudosRef: ReferenceType = useRef();
  const editorRef: any = useRef(null);
  const snackRef: any = useRef(null);

  const [userDetails, setUserDetails] = useState({
    uuid: '',
    first_name: '',
    last_name: '',
    roles: [],
    status: true,
  });

  const handleClose = useCallback((callParen: boolean = true) => {
    setOpen(false);
    if (onClose && callParen) {
      onClose(true);
    }
  }, [onClose]);

  const getUserRatings = useCallback((userId: string) => {
    setLoading(true);
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/rate/user/${userId}/${initiativeId}`)
      .then((response: ResponseType) => {
        setCurrentRating(response.body.currentUserRating?.rate);
        setOverallRating(response.body.overallRatings);
        setReviews(response.body.reviews);
        editorRef.current.setContents(response.body?.currentUserRating?.note);
      }).finally(() => {
        setLoading(false);
      });
  }, [initiativeId]);

  const rateUser = useCallback(() => {
    setLoading(true);
    request.setContentType('application/json');
    request.put(`${config.services.initiative}/rate/user/${userDetails.uuid}`, {
      rate,
      note: editorRef.current.getRawContents(),
      initiativeId,
    })
      .then(() => {
        snackRef.current.show(`You have rated ${userDetails.first_name}`);
        getUserRatings(userDetails.uuid);
      }).finally(() => {
        setLoading(false);
      });
  }, [getUserRatings, initiativeId, rate, userDetails.first_name, userDetails.uuid]);

  const kickUser = () => {
    setLoading(true);
    request.setContentType('application/json');
    return request.delete(`${config.services.initiative}/initiatives/leave/${initiativeId}/${userDetails.uuid}`)
      .then(() => {
        handleClose();
        onKick();
        return true;
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleOpen = (action: any) => {
    const option: any = {
      title: `Are you sure you want to delete ${userDetails.first_name} ?`,
      confirmText: 'Delete',
    };
    confirmRef
      .current
      .open(action, option, () => () => kickUser());
  };

  const handleKudos = () => {
    setOpen(true);
    kudosRef.current.open(userDetails);
  };
  const handleClickOpen = (userId: string) => {
    setOpen(true);
    userService.getProfile(userId)
      .then((response: ResponseType) => {
        setUserDetails(response.body);
        getUserRatings(response.body.uuid);
      });
  };

  const handleDelete = () => {
    handleOpen(true);
  };

  const handleKudosOnAdd = () => {
    snackRef.current.show('Kudos has been sent!');
  };

  useImperativeHandle(ref, () => ({
    open: handleClickOpen,
  }));

  return (
    <div>
      <Snackbar ref={snackRef} />
      <Confirm ref={confirmRef} />
      <Kudos ref={kudosRef} onAdd={handleKudosOnAdd} />
      <Dialog fullWidth maxWidth="md" open={open} onClose={() => handleClose(false)}>
        <DialogTitle id="form-dialog-title">
          {userDetails.first_name}
          {' '}
          {userDetails.last_name}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Grid container spacing={3}>
            <Grid item md={3}>
              <Avatar
                alt={userDetails.first_name}
                variant="square"
                src={`${config.services.file}/content/${userDetails.uuid}?direct=true`}
                className={classes.avatar}
              />
            </Grid>
            <Grid item md={9}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      Overall:
                    </Grid>
                    <Grid item xs={4}>
                      <Rating
                        value={Math.round(overallRating) ?? 0}
                        readOnly
                        precision={0.5}
                      />
                    </Grid>
                    <Grid item md={3}>
                      {overallRating !== null
                      && <Box ml={2}>{labels[Math.round(overallRating)]}</Box>}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item md={4}>
                      Your Rating:
                    </Grid>
                    <Grid item md={4}>
                      <Rating
                        name="rating"
                        value={currentRating ?? 0}
                        precision={0.5}
                        onChange={(event: InputType, newValue: number) => {
                          setRate(newValue);
                          setCurrentRating(newValue);
                        }}
                        onChangeActive={(event: InputType, newHover: number) => {
                          setHover(newHover);
                        }}
                      />
                    </Grid>
                    <Grid item md={3}>
                      {currentRating !== null
                      && <Box ml={2}>{labels[hover !== -1 ? hover : currentRating]}</Box>}
                    </Grid>
                  </Grid>
                  <Editor placeholder="Review" ref={editorRef} height="100px" toolbarHidden />
                  <Box mt={1} />
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={rateUser}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={6}>

                  <Scrollbars
                    autoHeight
                    autoHeightMin="200px"
                    autoHeightMax="200px"
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={1000}
                  >
                    {reviews.map((review: any) => (
                      <>
                        {!!review.note.length
                                                && (
                                                <Box mb={1}>
                                                  <Typography
                                                    className={classes.pos}
                                                    color="textSecondary"
                                                  >
                                                    {review.note}
                                                  </Typography>
                                                  <Typography variant="body2" component="div">
                                                    &quot;--Anonymous&quot;
                                                    {' '}
                                                    <Rating
                                                      className={classes.reviewStars}
                                                      value={review.rate}
                                                      readOnly
                                                      precision={0.5}
                                                    />
                                                  </Typography>
                                                </Box>
                                                )}
                      </>
                    ))}
                  </Scrollbars>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Close
          </Button>
          <Button onClick={handleDelete} color="default">
            Kick
          </Button>
          <Button onClick={handleKudos} color="default" loading={loading}>
            Give a Kudos
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
