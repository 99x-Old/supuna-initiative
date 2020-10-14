import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DragIndicator from '@material-ui/icons/DragIndicator';
import { makeStyles } from '@material-ui/core/styles';
import type { SectionContentType, SectionTitleType } from 'types/profile.type';
import Viewer from 'components/Elements/Viewer';

const useStyles = makeStyles({
  iconButton: {
    padding: '5px',
  },
  icon: {
    fontSize: '1rem',
  },
  content: {
    margin: '11',
  },
});

type PropsType = {
  contents: SectionContentType,
  editable: boolean,
  setEditMode: ()=>{},
  onDelete: ()=>{},
  dragHandler: any
};

export default ({
  contents, editable, setEditMode, onDelete, dragHandler,
}: PropsType) => {
  const classes = useStyles();
  const sectionRef: any = useRef(null);

  const [showEditableIcon, setShowEditableIcon] = useState(false);

  useEffect(() => {
    const sectionRefCurrent = sectionRef.current;
    if (sectionRefCurrent) {
      sectionRefCurrent.addEventListener('mouseover', () => {
        setShowEditableIcon(true);
      });
      sectionRefCurrent.addEventListener('mouseleave', () => {
        setShowEditableIcon(false);
      });
    }

    return () => {
      sectionRefCurrent.addEventListener('mouseover', () => {
      });
      sectionRefCurrent.addEventListener('mouseleave', () => {
      });
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <span {...dragHandler} />
      {contents && (
      <>
        <Typography variant="h6" gutterBottom>
          {contents.title.text}
          <Box component="span" display={editable && showEditableIcon ? 'inline' : 'none'}>
            <IconButton onClick={() => setEditMode(true)} className={classes.iconButton}>
              <EditIcon className={classes.icon} />
            </IconButton>
            {onDelete && (
            <IconButton
              onClick={() => onDelete(contents.id, contents.name)}
              className={classes.iconButton}
            >
              <DeleteOutlineIcon className={classes.icon} />
            </IconButton>
            )}
            <IconButton className={classes.iconButton} {...dragHandler}>
              <DragIndicator className={classes.icon} />
            </IconButton>
          </Box>
        </Typography>
        {contents.tags && (
        <Typography component="div" gutterBottom>
          {contents.tags
            .map((tag: SectionTitleType, index: number) => <Chip key={index} label={tag} />)}
        </Typography>
        )}
        <Viewer escapeHtml={false} source={contents.text} />
      </>
      )}
    </div>
  );
};
