import React, { forwardRef, useImperativeHandle } from 'react';
import './Dot.scss';
import type { PropsType } from '../../types/react.type';

export default forwardRef(({ left }: PropsType, ref: any) => {
  useImperativeHandle(ref, () => ({}));

  return (
    <div ref={ref}>
      {left}
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </div>
  );
});
