import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import type { PropsType } from 'types/react.type';
import type { InputType } from 'types/html.type';

const useStyles = makeStyles(() => ({
  input: {},
}));

export default ({ onChange }: PropsType) => {
  const classes = useStyles();
  const [keyword, setKeyword] = React.useState('');
  return (
    <form onSubmit={(e: InputType) => {
      e.preventDefault();
      onChange(keyword);
    }}
    >
      <TextField
        placeholder="Search..."
        className={classes.input}
        onChange={(e: InputType) => {
          setKeyword(e.target.value);
          e.preventDefault();
        }}
      />
    </form>
  );
};
