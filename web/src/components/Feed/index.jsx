import { Divider, List, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useRef } from 'react';
import Editor from 'components/Editor';
import PosterService from 'services/poster.service';
import type { PostType } from 'types/post.type';
import Post from 'components/Elements/Post';
import type { PropsType } from '../../types/react.type';
import Socket from '../../services/request/socket';
import type { DataInterface } from '../../services/request/socket/data.interface';
import SkeletonComments from '../Initiative/Skeleton/SkeletonComments';

const socket = new Socket('feed');

export default ({ reference, placeholder }: PropsType) => {
  const [posts, setPosts] = React.useState([{ data: [] }]);
  const [loading, setLoading] = React.useState(false);
  const editorRef: any = useRef(null);

  const postUpdated = () => {
    const data: DataInterface = {
      channel: `feed-${reference}`,
      event: 'feed-updated',
      data: {
        reference,
      },
    };
    socket.send(data);
  };
  const refreshPosts = useCallback(() => {
    const posterService = new PosterService();
    posterService.list(reference)
      .then((response: ResponseType) => {
        setPosts(response.body);
      });
  }, [reference]);

  const submitPost = (content: string, postReference: string) => {
    setLoading(true);
    const posterService = new PosterService();
    posterService.post(content, postReference)
      .then((post: PostType) => {
        setPosts((currentPosts: { data: PostType[] }) => ({
          ...currentPosts,
          ...{ data: [post, ...currentPosts.data] },
        }));
        editorRef.current.clear();
        postUpdated();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (deletedPost: PostType) => {
    setPosts((currentPosts: { data: PostType[] }) => ({
      ...currentPosts,
      ...{
        data: currentPosts.data
          .filter((post: PostType) => post.uuid !== deletedPost.uuid),
      },
    }));
  };

  useEffect(() => {
    socket.disconnect(['feed-updated']);
    socket
      .join(`feed-${reference}`)
      .listen('feed-updated', async () => {
        refreshPosts();
      });
  }, [reference, refreshPosts]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return (
    <>
      <Editor
        toolbarHidden
        placeholder={placeholder ?? "What's on your mind ?"}
        saveText="Post"
        save={() => submitPost(editorRef.current.getRawContents(), reference)}
        loading={loading}
        ref={editorRef}
      />
      <Typography component="div">
        {(!posts?.data) && <SkeletonComments />}
        <List>
          {posts?.data?.map((post: PostType, index: number) => (
            <div key={index}>
              <Post
                post={post}
                postDeleted={handleDelete}
              />
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      </Typography>
    </>
  );
};
