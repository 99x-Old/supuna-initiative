import React, { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import Button from '../../Elements/Button';
import Create from './Create';
import type { ReferenceType } from '../../../types/html.type';
import List from './List';
import type { PropsType } from '../../../types/react.type';
import Review from './Review';

export default ({ sub }: PropsType) => {
  const [loading] = React.useState(false);
  const createRef: ReferenceType = useRef(null);

  const handleCreate = () => {
    createRef.current.openCreate();
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(sub);
  }, [sub]);

  return (
    <div>
      <Create ref={createRef} />
      {!sub && (
      <Button color="primary" loading={loading} variant="contained" onClick={handleCreate}>
        Create Cycle
      </Button>
      )}
      <Box mt={1} />
      {!sub ? <List /> : <Review cycleId={sub} />}
    </div>
  );
};
