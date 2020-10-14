import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box } from '@material-ui/core';
import InitiativeItem from './InitiativeItem';

type PropsType = {
    initiatives: any[],
    year: string,
    onRemoveInitiative: any
};
export default forwardRef(({ initiatives, year, onRemoveInitiative }: PropsType, ref: any) => {
  const itemsRef = useRef({});

  const get = () => Object.keys(itemsRef.current)
    .map((key: string) => itemsRef.current[key]
      .getInitiative());

  useImperativeHandle(ref, () => ({
    get,
  }));

  return (
    <>
      {initiatives.map((initiative: any) => (
        <Box key={initiative.uuid} bgcolor="background.paper">
          <InitiativeItem
            onRemoveInitiative={onRemoveInitiative}
            initiative={initiative}
            year={year}
            ref={(el: any) => {
              itemsRef.current[initiative.uuid] = el;
            }}
          />
          <Box mt={1} />
        </Box>
      ))}
    </>
  );
});
