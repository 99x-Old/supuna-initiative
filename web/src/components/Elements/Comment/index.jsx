import ListItem from '@material-ui/core/ListItem';
import { Box, Theme, Typography } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import type { CommentType } from 'types/post.type';
import PosterService from 'services/poster.service';
import type { ReferenceType } from 'types/html.type';
import Viewer from '../Viewer';
import Menu from './Menu';

const useStyles = makeStyles((theme: Theme) => ({
  commentTitle: {
    color: theme.palette.secondary.contrastText,
  },
  commentItem: {
    padding: 0,
  },

}));
type PropsType = {
    comment: CommentType,
    commentDeleted: any
};
export default ({ comment, commentDeleted }: PropsType) => {
  const classes = useStyles();

  const menuRef: ReferenceType = useRef(null);
  const commentRef: ReferenceType = useRef(null);
  const [commentOnHover, setCommentOnHover] = React.useState(false);

  const removeComment = () => {
    const posterService = new PosterService();
    posterService.deleteComment(comment.uuid)
      .then(() => {
        if (commentDeleted) {
          menuRef.current.handleClose();
          commentDeleted(comment);
        }
      })
      .finally(() => {

      });
  };

  const handlePostMenu = (event: Event) => {
    menuRef.current.handleMenu(event);
  };
  useEffect(() => {
    const sectionRefCurrent = commentRef.current;
    if (sectionRefCurrent) {
      sectionRefCurrent.addEventListener('mouseover', () => {
        setCommentOnHover(true);
      });
      sectionRefCurrent.addEventListener('mouseleave', () => {
        setCommentOnHover(false);
      });
    }
  });

  return (
    <Box ref={commentRef}>
      <ListItem disableGutters alignItems="flex-start" className={classes.commentItem}>
        <ListItemText
          primary={(
            <>
              <Box display="flex">
                <Box flexGrow={1}>
                  <Typography variant="body2" display="block" className={classes.sub} component="div">
                    <Viewer
                      escapeHtml={false}
                      source={comment.content}
                    />
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    color="default"
                    onClick={handlePostMenu}
                    style={{
                      right: '-5px',
                      position: 'relative',
                      visibility: commentOnHover ? 'visible' : 'hidden',
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu ref={menuRef} menuItem={{ removeComment }} />
                </Box>
              </Box>
              <Box>
                <small title={moment.utc(comment.created_at)
                  .format('LLLL')}
                >
                  {moment.utc(comment.created_at)
                    .fromNow()}
                </small>
              </Box>
            </>
                    )}
        />
      </ListItem>
    </Box>
  );
};
