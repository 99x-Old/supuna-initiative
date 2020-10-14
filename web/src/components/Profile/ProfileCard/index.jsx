import Button from 'components/Elements/Button';
import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import Uploader from 'components/Uploader';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'actions';
import { ProfileType } from 'types/profile.type';
import config from 'config';
import type { ErrorResponseType } from 'types/response.type';
import type { StoreType } from 'types/store.type';
import Snackbar from 'components/Shared/Snackbar';

const useStyles = makeStyles({
  media: {
    height: 330,
  },
  card: {
    width: 300,
  },
  uploader: {},
});

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const uploadRef: any = useRef(null);
  const snackRef: any = useRef(null);

  const [, setProfileImageRef]: any = useState('');

  const profile: ProfileType = useSelector((state: StoreType) => state.profile);

  const [uploader:boolean, setUploader]: any = useState(false);
  const [loader, setLoader]: any = useState(false);

  const openUploader = () => {
    setUploader(true);
  };

  const closeUploader = () => {
    setUploader(false);
  };

  const upload = () => {
    setLoader(true);
    uploadRef.current.upload(profile.uuid)
      .then(() => {
        dispatch(updateProfile(
          `${config.services.file}/content/${profile.uuid}?direct=true&timestamp${+new Date()}`,
          'profile_image',
        ));
        setProfileImageRef(+new Date());
        closeUploader();
        setLoader(false);
      }).catch((error: ErrorResponseType) => {
        setLoader(false);
        snackRef.current.show(error.message);
      });
  };

  return (
    <>
      <Snackbar ref={snackRef} />
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            onClick={openUploader}
            className={classes.media}
            image={`${config.services.file}/content/${profile.uuid}?direct=true`}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              {profile.first_name}
              {' '}
              {profile.last_name}
              {' '}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p"> We both looked into the abyss, but when it looked back at us, you blinked.</Typography>
          </CardContent>
        </CardActionArea>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={uploader}
          onClose={closeUploader}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="form-dialog-title">Change Profile Picture</DialogTitle>
          <DialogContent style={{ overflow: 'hidden' }} className={classes.uploader}>
            <Uploader ref={uploadRef} file="https://via.placeholder.com/300x330" />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={closeUploader}>
              Close
            </Button>
            <Button loading={loader} color="primary" onClick={upload}>
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
};
