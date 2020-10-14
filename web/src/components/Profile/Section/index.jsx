import React, { useEffect, useRef, useState } from 'react';
import config from 'config';
import type { SectionContentType } from 'types/profile.type';
import request from 'services/request';
import Confirm from 'components/Helpers/Confirm';
import _ from 'lodash';
import { Box } from '@material-ui/core';
import Editor from './Editore';
import Viewer from './Viewer';
import AddSection from './AddSectionButton';

type PropsType = {
  contents: SectionContentType,
  name: string,
  editable: boolean,
  addSection: boolean,
  onSave: ()=>{},
  onRemove: ()=>{},
  dragHandler: any
};

export default ({
  contents, name, editable, onSave, onRemove, dragHandler, addSection,
}: PropsType) => {
  const sectionRef: any = useRef(null);
  const confirmRef: any = useRef(null);

  const [
    currentContents: SectionContentType[],
    setCurrentContents:(SectionContentType)=>{},
  ] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const save = (sectionName: string, content: SectionContentType) => {
    request.setContentType('application/json');
    setLoading(true);

    return request.put(`${config.services.user}/section/update/${sectionName}`, content)
      .then((response: ResponseType) => response.body)
      .then((savedContents: SectionContentType) => {
        setCurrentContents(savedContents);
        if (onSave) {
          onSave(savedContents);
        }
        setEditMode(false);
      })
      .catch(() => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const remove = (id: string, sectionName: string) => {
    request.setContentType('application/json');
    setLoading(true);

    return request.delete(`${config.services.user}/section/delete/${id}/${sectionName}`)
      .then((response: ResponseType) => response.body)
      .then((removedContents: SectionContentType) => {
        if (onRemove) {
          onRemove(removedContents);
          setCurrentContents(false);
        }
        return removedContents;
      })
      .catch(() => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveHandler = (changedContents: SectionContentType) => save(name, changedContents);
  const removeHandler = (id: string, sectionName: string) => {
    const option: any = {
      title: 'Are you sure you want to remove this section ?',
      confirmText: 'Remove',
    };
    confirmRef.current.open(true, option, () => () => remove(id, sectionName));
  };

  useEffect(() => {
    setCurrentContents(contents);
  }, [contents]);

  return (
    <div>
      <Confirm ref={confirmRef} />
      {editMode
        ? (
          <Editor
            loading={loading}
            contents={_.cloneDeep(currentContents)}
            save={saveHandler}
            setEditMode={setEditMode}
          />
        )
        : !addSection && (
          <Box ref={sectionRef}>
            <Viewer
              dragHandler={dragHandler}
              contents={currentContents}
              editable={editable}
              setEditMode={setEditMode}
              onDelete={removeHandler}
            />
          </Box>
        )}

      {addSection && !editMode && (
        <AddSection
          text="Add a Section"
          onClick={() => {
            setEditMode(true);
          }}
        />
      )}

    </div>
  );
};
