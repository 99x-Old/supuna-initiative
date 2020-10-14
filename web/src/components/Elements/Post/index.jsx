import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {
  Avatar, Box, Link, List, Theme, Typography,
} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import Comment from 'components/Elements/Comment';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import type { CommentType, PostType } from 'types/post.type';
import PosterService from 'services/poster.service';
import { useHistory } from 'react-router-dom';
import type { ReferenceType } from 'types/html.type';
import { makeStyles } from '@material-ui/core/styles';
import Editor from '../../Editor';
import Viewer from '../Viewer';
import Menu from './Menu';
import config from '../../../config';

const useStyles = makeStyles((theme: Theme) => ({
  post: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  },
}));

type PropsType = {
    post: PostType,
    postDeleted: ()=>{}
};
export default ({ post, postDeleted }: PropsType) => {
  const history = useHistory();
  const classes = useStyles();

  const [comments, setComments] = React.useState([]);
  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const [commentSubmitLoading, setCommentSubmitLoading] = React.useState(false);
  const [, setCommentLoading] = React.useState(false);
  const [postOnHover, setPostOnHover] = React.useState(false);

  const menuRef: ReferenceType = useRef(null);
  const postRef: ReferenceType = useRef(null);
  const editorRef: any = useRef(null);

  const submitComment = (currentPost: PostType, content: string) => {
    setCommentSubmitLoading(true);
    const posterService = new PosterService();
    posterService.postComment(currentPost.uuid, content)
      .then((newComments: CommentType) => {
        setComments((currentComments: CommentType[]) => ([...currentComments, newComments]));
        editorRef.current.setContents('');
      })
      .finally(() => {
        setCommentSubmitLoading(false);
      });
  };
  const removePost = () => {
    const posterService = new PosterService();
    posterService.delete(post.uuid)
      .then(() => {
        if (postDeleted) {
          menuRef.current.handleClose();
          postDeleted(post);
        }
      })
      .finally(() => {

      });
  };
  const showMoreComments = (currentPost: PostType, lastCommentId: string) => {
    setCommentLoading(true);
    const posterService = new PosterService();
    posterService.getComments(currentPost.uuid, lastCommentId)
      .then((newComments: any) => {
        setComments((currentComments: CommentType[]) => ([
          ...newComments.data,
          ...currentComments]));
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };
  const handlePostMenu = (event: Event) => {
    menuRef.current.handleMenu(event);
  };

  const handleDelete = (deletedComment: CommentType) => {
    setComments((currentComments: CommentType[]) => currentComments
      .filter((comment: CommentType) => comment.uuid !== deletedComment.uuid));
  };

  const goToProfile = (e: Event) => {
    history.push(`/profile/${post.user}`);
    e.preventDefault();
  };

  useEffect(() => {
    if (post.comments) {
      setComments(post.comments);
    }
  }, [post.comments]);

  useEffect(() => {
    const sectionRefCurrent = postRef.current;
    if (sectionRefCurrent) {
      sectionRefCurrent.addEventListener('mouseover', () => {
        setPostOnHover(true);
      });
      sectionRefCurrent.addEventListener('mouseleave', () => {
        setPostOnHover(false);
      });
    }

    return () => {
      sectionRefCurrent.removeEventListener('mouseover', () => {
      });
      sectionRefCurrent.removeEventListener('mouseleave', () => {
      });
    };
  }, []);

  return (
    <Box ref={postRef} mb={1} mt={1}>
      <ListItem alignItems="flex-start" className={classes.post}>
        <ListItemAvatar>
          <Link href={`profile/${post.user}`} onClick={goToProfile} underline="none">
            <Avatar
              src={`${config.services.file}/content/${post.user}?direct=true`}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography
          primary={(
            <>
              <Box display="flex">
                <Box flexGrow={1}>
                  <Viewer escapeHtml={false} source={post.content} />
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    color="default"
                    onClick={handlePostMenu}
                    style={{
                      right: '10px',
                      position: 'absolute',
                      visibility: postOnHover ? 'visible' : 'hidden',
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu menuItem={{ removePost }} ref={menuRef} />
                </Box>
              </Box>
              <small title={moment.utc(post.created_at).format('LLLL')}>
                {moment.utc(post.created_at).fromNow()}
              </small>
              <Box display="inline" ml={1}>
                <Link
                  to="#reply"
                  style={{ fontFamily: 'inherit' }}
                  component="button"
                  onClick={() => {
                    setShowCommentInput(!showCommentInput);
                  }}
                >
                  Reply
                </Link>
                {' '}
              </Box>

            </>
                    )}
          secondary={(
            <>
              {!!comments.length && (
                <List>
                  {comments[0].uuid && (
                  <Link
                    to="#show-more-comments"
                    style={{ fontFamily: 'inherit' }}
                    type="button"
                    component="button"
                    onClick={() => {
                      showMoreComments(post, comments[0].uuid);
                    }}
                  >
                    Show more comments
                  </Link>
                  )}
                  {comments.map((comment: CommentType, index: number) => (
                    <Comment comment={comment} commentDeleted={handleDelete} key={index} />
                  ))}
                </List>
              )}
              {showCommentInput && (
              <Typography variant="subtitle2" display="block" component="div">
                <Editor
                  ref={editorRef}
                  toolbarHidden
                  pressEnterSave
                  className="hide"
                  placeholder="Comment..."
                  saveText="Comment"
                  loading={commentSubmitLoading}
                  save={() => submitComment(post, editorRef.current.getRawContents())}
                />
              </Typography>
              )}
            </>
                    )}
        />
      </ListItem>
    </Box>
  );
};
