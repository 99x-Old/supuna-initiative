import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle, useState,
} from 'react';
import Editor from 'draft-js-plugins-editor';
import createInlineToolbarPlugin, { ToolbarChildrenProps } from 'draft-js-inline-toolbar-plugin';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Theme } from '@material-ui/core';
import draftToHtml from 'draftjs-to-html';
import Button from 'components/Elements/Button';
import DotSpinner from 'components/Loader/Dot';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
  RawDraftContentBlock,
  SelectionState,
} from 'draft-js';

import {
  BlockquoteButton,
  BoldButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from 'draft-js-buttons';

import 'draft-js/dist/Draft.css';

const useStyles = (props: any) => makeStyles((theme: Theme) => ({
  richEditorRoot: {
    border: props.noBorder ? 'none' : `1px solid ${theme.palette.secondary.borderColor} !important`,
    backgroundColor: theme.palette.secondary.light,
    borderRadius: '2px !important',
    '& .public-DraftEditor-content': {
      minHeight: `${props.height}`,
    },
  },
  actions: {
    textAlign: 'right',
  },
  buttonExtraSmall: {
    padding: 0,
  },
}));

export default forwardRef(({
  props,
  loading,
  contents,
  close,
  save,
  closeText,
  saveText,
  pressEnterSave,
  onTyping,
  placeholder,
  height,
  noBorder,
  toolbarHidden,
}: any, ref: any) => {
  const classes = useStyles({ height, noBorder })();

  const [state, setState] = useState({
    editorState: EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(contents ?? ''),
      ),
    ),
  });
  const [editorContent, setEditorContent] = useState();
  const [triggerTyping, setTriggerTyping] = useState(true);

  const [{ plugins, InlineToolbar }] = useState(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    const ToolBar = inlineToolbarPlugin.InlineToolbar;
    const pluginsList = [inlineToolbarPlugin];
    return {
      plugins: pluginsList,
      InlineToolbar: ToolBar,
    };
  });

  const clear = () => {
    let { editorState } = state;
    let contentState = editorState.getCurrentContent();
    const firstBlock = contentState.getFirstBlock();
    const lastBlock = contentState.getLastBlock();
    const allSelected = new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: 0,
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getLength(),
      hasFocus: true,
    });
    contentState = Modifier.removeRange(contentState, allSelected, 'backward');
    editorState = EditorState.push(editorState, contentState, 'remove-range');
    editorState = EditorState.forceSelection(
      editorState,
      contentState.getSelectionAfter(),
    );
    setState({ editorState });
  };

  const closeEditor = () => {
    close();
  };

  /**
   * Get contents when change
   * @param editorState
   */
  const onChange = (editorState: any) => {
    setState({
      editorState,
    });

    const value = editorState.getCurrentContent().getPlainText();
    setEditorContent(value);
  };

  const onTypingHandler = useCallback(() => {
    if (onTyping) {
      const html = draftToHtml(convertToRaw(state.editorState.getCurrentContent()))
        .replace(/(<([^>]+)>)/gi, '')
        .trim();
      onTyping(html);
    }
  }, [onTyping, state.editorState]);

  const saveHandler = () => {
    if (save) {
      const { editorState } = state;
      const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      save(html);
    }
  };

  const getContents = () => {
    const { editorState } = state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  const getRawContents = () => {
    const { editorState } = state;
    const { blocks } = convertToRaw(editorState.getCurrentContent());
    return blocks.map((block: RawDraftContentBlock) => (!block.text.trim() && '\n') || block.text).join('\n').trim();
  };

  const onEditorStateChange = (editorState: any) => {
    setState({
      editorState,
    });
  };

  const handleKeyCommand = (e: any) => {
    setTriggerTyping(true);
    if (pressEnterSave && e.keyCode === 13 && !e.nativeEvent.shiftKey) {
      saveHandler();
      return false;
    }
    return getDefaultKeyBinding(e);
  };

  useEffect(() => {
    if (triggerTyping) {
      onTypingHandler();
    }
  }, [editorContent, onTypingHandler, toolbarHidden, triggerTyping]);

  const setContents = (text: string = '') => {
    setTriggerTyping(false);
    setState((currentState: any) => ({
      ...currentState,
      ...{
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(text),
          ),
        ),
      },
    }));
  };

  useImperativeHandle(ref, () => ({
    clear, getContents, setContents, getRawContents,
  }));

  return (
    <div className={classes.richEditorRoot}>
      <>
        <Box p={0.8} display="flex">
          <Box width="100%">
            <Editor
              placeholder={placeholder}
              editorState={state.editorState}
              keyBindingFn={handleKeyCommand}
              onChange={onChange}
              onEditorStateChange={onEditorStateChange}
              plugins={plugins}
              {...props}
            />
            {!toolbarHidden && (
            <InlineToolbar>
              {
                (externalProps: ToolbarChildrenProps) => (
                  <div style={{ textAlign: 'center' }}>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    <br />
                    <HeadlineOneButton {...externalProps} />
                    <HeadlineTwoButton {...externalProps} />
                    <HeadlineThreeButton {...externalProps} />
                    <br />
                    <UnorderedListButton {...externalProps} />
                    <OrderedListButton {...externalProps} />
                    <BlockquoteButton {...externalProps} />
                  </div>
                )
              }
            </InlineToolbar>
            )}
          </Box>
          <Box flexShrink={0} p={0} className={classes.actions}>
            {loading ? <DotSpinner />
              : (
                <>
                  {close && (
                  <Button
                    size="small"
                    className={classes.buttonExtraSmall}
                    color="primary"
                    onClick={closeEditor}
                  >
                    {closeText ?? 'Close'}
                  </Button>
                  )}
                  {!pressEnterSave && save && (
                  <Button
                    onClick={saveHandler}
                    size="small"
                    color="primary"
                    variant="contained"
                    className={classes.buttonExtraSmall}
                  >
                    {saveText ?? 'Save'}
                  </Button>
                  )}
                </>
              )}
          </Box>
        </Box>
      </>
    </div>
  );
});
