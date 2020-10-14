import React, { useCallback, useRef } from 'react';
import Editor from 'components/Editor';
import { Box } from '@material-ui/core';
import Button from 'components/Elements/Button';
import request from 'services/request';
import config from 'config';
import Snackbar from 'components/Shared/Snackbar';

export default () => {
  const nameRef: any = useRef(null);
  const editorRef: any = useRef(null);
  const snackRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);

  const createDepartment = useCallback(() => {
    setLoading(true);
    const name = nameRef.current.getRawContents();
    const description = editorRef.current.getContents();

    request.setContentType('application/json');
    request.post(`${config.services.initiative}/departments`, { name, description })
      .then(() => {
        nameRef.current.setContents('');
        editorRef.current.setContents('');
        snackRef.current.show('Department has been created!');
      }).catch(() => {
        snackRef.current.show('Fill all the values!', { variant: 'error' });
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Editor placeholder="Department Name" ref={nameRef} />
      <Box mt={1} />
      <Editor placeholder="Description" ref={editorRef} height="100px" />
      <Box mt={1} flexDirection="row-reverse" display="flex">
        <Button color="primary" onClick={createDepartment} loading={loading} variant="contained">
          Create
        </Button>
      </Box>
      <Snackbar ref={snackRef} />
    </div>
  );
};
