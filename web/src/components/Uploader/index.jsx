import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactCrop from 'react-image-crop';
import { useDropzone } from 'react-dropzone';
import './Uploader.scss';
import request from 'services/request';
import Snack from 'components/Alerts/Snack';
import config from 'config';
import type { InputType } from '../../types/html.type';

const useStyles = makeStyles((theme: Theme) => ({
  uploader: {},
  uploaderButton: {
    color: theme.palette.secondary.contrastText,
    outline: 'none',
    cursor: 'pointer',
    padding: 0,
    border: 'dashed #6f6f6f 2px',
  },
  uploadedImage: {
    background: theme.palette.secondary.main,
    height: '325px',
    padding: '5px',
  },
}));

export default forwardRef((props: any, ref: any) => {
  const classes = useStyles();
  const alertRef: any = useRef(null);
  const imgRef: any = useRef(null);

  const [upImg, setUpImg] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 20, aspect: 30 / 33 });
  const [, setCropData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  /**
     * Dropzone Logic
     */
  const onDrop = useCallback((uploadedFile: []) => {
    setUploadedFiles(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event: InputType) => {
      setUpImg(event.target.result);
    };
    reader.readAsDataURL(uploadedFile[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /**
     * image cropper
     */

  const onLoad = useCallback((img: any) => {
    imgRef.current = img;
  }, []);

  const makeClientCrop = (cropDetails: {}) => {
    if (imgRef.current && cropDetails.width && cropDetails.height) {
      setCropData(cropDetails);
    }
  };
  const upload = async (reference: string) => (new Promise((resolve: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFiles[0]);

    reader.onload = () => {
      const formData = {
        file: reader.result,
        reference,
      };
      request.setContentType('application/json');
      return request.post(`${config.services.file}/file`, formData)
        .then((response: ResponseType) => resolve(response.body))
        .catch((error: Error) => {
          alertRef.current.showAlert(error.message);
          return error.message;
        });
    };
  }));

  useImperativeHandle(ref, () => ({
    upload,
  }));

  return (
    <div ref={ref} className={classes.uploader}>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box mb={2} mt={2}>
            <div {...getRootProps()} className={classes.uploaderButton}>
              <input {...getInputProps()} />
              <Card>
                <CardContent style={{ padding: '16px' }}>
                  <Typography component="div" color="inherit">
                    {isDragActive ? 'Drop Here' : 'Select a file'}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} hidden={!upImg}>
          <Box display="flex" justifyContent="center" className={classes.uploadedImage}>
            <ReactCrop
              style={{ maxHeight: '325px' }}
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c: any) => setCrop(c)}
              onComplete={makeClientCrop}
            />

          </Box>
        </Grid>
      </Grid>

      <Snack ref={alertRef} />
    </div>
  );
});
