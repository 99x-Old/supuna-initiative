import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import type { PropsType } from 'types/react.type';
import Viewer from 'components/Elements/Viewer';
import config from 'config';
import request from 'services/request';
import Editor from '../../Editor';

export default ({ initiative }: PropsType) => {
  const objectiveRef = useRef(null);
  const [editObjective, setEditObjective] = useState(false);
  const [objectives, setObjectives] = useState('');
  const [loading, setLoading] = React.useState(false);

  const updateObjective = (note: string) => {
    setLoading(true);
    request.setContentType('application/json');
    setLoading(true);
    request
      .put(`${config.services.initiative}/initiative-years/initiative/notes/${initiative.uuid}`, { note })
      .then(() => {
        setObjectives(note);
      })
      .finally(() => {
        setLoading(false);
      });

    setEditObjective(false);
  };
  useEffect(() => {
    setObjectives(initiative.objectives);
  }, [initiative.objectives]);

  return (
    <Box>
      {initiative.objectives && (
      <>
        <Typography variant="h6" onDoubleClick={() => setEditObjective(true)}>Objective</Typography>
          {!editObjective && (
            <Box onDoubleClick={() => setEditObjective(true)}>
              <Viewer
                escapeHtml={false}
                source={objectives}
              />
            </Box>
          )}
          {editObjective && (
          <Editor
            loading={loading}
            contents={initiative.objectives}
            ref={objectiveRef}
            close={() => { setEditObjective(false); }}
            save={(updatedText: string) => { updateObjective(updatedText); }}
          />
          )}
      </>
      )}
    </Box>
  );
};
