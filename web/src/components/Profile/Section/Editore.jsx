import React, {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import {
  Box, Chip, Input, Theme, Typography,
} from '@material-ui/core';
import Autocomplete, { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';
import type { SectionContentType, SectionTitleType } from 'types/profile.type';
import type { InputType } from 'types/html.type';
import Editor from 'components/Editor';
import Button from 'components/Elements/Button';
import { TextField } from 'components/Elements';

const useStyles = makeStyles((theme: Theme) => ({
  section: {},
  title: {
    '& input': {
      paddingLeft: '0 !important;',
      fontSize: theme.typography.h6.fontSize,
    },
  },
  input: { padding: '0 !important;' },
}));

export default ({
  contents, save, setEditMode, loading,
}: PropsType): void => {
  const classes = useStyles();
  const editorRef: any = useRef(null);

  const [currentContents: SectionContentType, setCurrentContents] = useState({
    title: {
      text: '',
      readonly: false,
    },
    tags: [],
    text: '',
  });
  const [currentTag: SectionTitleType, setCurrentTag] = useState('');
  const [sections: SectionTitleType[], setSections] = useState([
    { name: 'Interest' },
    { name: 'Music' },
  ]);
  const [selectedSection: SectionTitleType, setSelectedSection] = useState({});

  const addTag = (e: InputType) => {
    if (e.keyCode === 13) {
      setCurrentContents(
        {
          ...currentContents,
          ...{ tags: [...currentContents.tags, e.target.value] },
        },
      );
      setCurrentTag('');
    }
  };

  const saveHandler = () => {
    if (save) {
      const currentContentsSaving = currentContents;
      currentContentsSaving.text = editorRef.current.getContents();
      save(currentContentsSaving);
    }
  };

  const handleTagRemove = (tagKey: string) => {
    const tags = currentContents
      .tags
      .filter((chip: string, key: number) => key !== tagKey);

    setCurrentContents(
      {
        ...currentContents,
        ...{ tags },
      },
    );
  };

  const addNewSectionTitle = (e: InputType) => {
    if (!e.target.value) return;
    const newSection = { name: e.target.value };
    if (!_.find(sections, newSection)) {
      setSections([...[newSection], ...sections]);
      setSelectedSection(newSection);
    }
  };

  const setCurrentTitle = (title: string) => {
    const currentContentsChanging = currentContents;
    currentContentsChanging.title.text = title;
    setCurrentContents(currentContentsChanging);
  };

  const handleClose = () => {
    setCurrentContents({
      title: {
        text: 'asasas',
        readonly: false,
      },
      tags: [],
      text: '',
    });
    setEditMode(false);
  };

  useEffect(() => {
    if (contents) {
      setCurrentContents(contents);
      setSelectedSection({
        name: contents.title.text,
      });
    }
  }, [contents]);

  return (
    <div>
      {currentContents.title.readonly
        ? <Typography variant="h6" gutterBottom>{currentContents.title.text}</Typography>
        : (
          <Autocomplete
            onClose={addNewSectionTitle}
            onChange={(e: ChangeEvent, changedTitle: SectionTitleType) => {
              setCurrentTitle(changedTitle.name);
              setSelectedSection(changedTitle);
            }}
            popupIcon={false}
            disableClearable
            noOptionsText="Add your own title"
            value={selectedSection}
            options={sections}
            className={classes.title}
            getOptionLabel={(option: SectionTitleType) => option.name ?? ''}
            getOptionSelected={
              (option: SectionTitleType, value: SectionTitleType) => value
                .name === option.name || true
            }
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                fullWidth
                onChange={(e: any) => setCurrentTitle(e.target.value)}
                placeholder="Select or add your own section"
              />
            )}
          />
        )}

      {contents.tags && (
        <Box mt={1}>
          {currentContents.tags.map((tag: SectionTitleType, index: number) => (
            <Chip
              key={index}
              onDelete={() => handleTagRemove(index)}
              label={tag}
            />
          ))}
          <Input
            disableUnderline
            value={currentTag}
            placeholder="Add tags..."
            onKeyDown={addTag}
            onChange={(e: any) => setCurrentTag(e.target.value)}
          />
        </Box>
      )}
      <Box mt={1} />
      <Editor contents={contents.text} placeholder="Note" ref={editorRef} />
      <Button onClick={handleClose}>
        <CloseIcon className={classes.icon} />
        {' '}
        Close
      </Button>
      <Button color="primary" loading={loading} onClick={saveHandler}>
        Save
      </Button>
    </div>
  );
};
