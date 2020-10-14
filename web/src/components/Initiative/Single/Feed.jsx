import React from 'react';
import type { PostType } from 'types/post.type';
import { Scrollbars } from 'react-custom-scrollbars';
import Feed from '../../Feed';

export default ({ initiative }: PostType) => (
  <>
    <Scrollbars
      style={{ height: 'calc(100vh - 227px' }}
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={1000}
    >
      <Feed reference={initiative.uuid} />
    </Scrollbars>
  </>
);
