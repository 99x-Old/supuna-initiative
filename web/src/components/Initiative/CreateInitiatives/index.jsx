import React, { useCallback, useEffect, useRef } from 'react';
import Editor from 'components/Editor';
import { Box, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from 'components/Elements/Button';
import request from 'services/request';
import config from 'config';
import Snackbar from 'components/Shared/Snackbar';

export default () => {
  const nameRef: any = useRef(null);
  const editorRef: any = useRef(null);
  const snackRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [departments, setDepartments] = React.useState([]);
  const [department, setDepartment] = React.useState(null);

  const createInitiative = useCallback(() => {
    setLoading(true);
    const name = nameRef.current.getContents();
    const description = editorRef.current.getContents();

    request.setContentType('application/json');
    request.post(`${config.services.initiative}/initiatives`, { name, description, department })
      .then(() => {
        nameRef.current.setContents('');
        editorRef.current.setContents('');
        snackRef.current.show('Initiative has been created!');
      }).catch(() => {
        snackRef.current.show('Fill all the values!', { variant: 'error' });
      }).finally(() => {
        setLoading(false);
      });
  }, [department]);

  const getDepartments = useCallback(() => {
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/departments`)
      .then((response: ResponseType) => {
        setDepartments(response.body);
      });
  }, []);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  return (
    <div>
      <Editor placeholder="Initiative Name" ref={nameRef} />
      <Box mt={1} />
      <Editor placeholder="Description" ref={editorRef} height="100px" />
      <Box mt={1} />
      <Autocomplete
        onChange={(e: Event, changedDepartment: any) => setDepartment(changedDepartment.id)}
        noOptionsText="No Departments"
        options={departments}
        getOptionLabel={(option: any) => option.name}
        renderInput={(params: any) => <TextField {...params} placeholder="Department" />}
      />
      <Box mt={1} flexDirection="row-reverse" display="flex">
        <Button color="primary" onClick={createInitiative} loading={loading} variant="contained">
          Create
        </Button>
      </Box>
      <Snackbar ref={snackRef} />
    </div>
  );
};
