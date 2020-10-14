import React from 'react';
import ReactMarkdown, { MarkdownAbstractSyntaxTree } from 'react-markdown';
import { makeStyles } from '@material-ui/core/styles';
import type { PropsType } from 'types/react.type';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    '& p': {
      margin: '0',
      marginBottom: '0.5rem',
    },
    '& a': {
      textDecoration: 'none',
      color: theme.palette.primary.main,
      padding: ' 1px 2px',
      borderRadius: '2px',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));

export default (props: PropsType) => {
  const classes = useStyles();
  const { max, raw } = props;

  const getStripedValue = (text: string) => text.replace(/<[^>]*>?/gm, '');

  const truncate = (str: string, length: number) => ((length && getStripedValue(str).length > length) ? `${str.substr(0, length - 1)}&hellip;` : str);

  const toHashtag = (text: string) => text
    .replace(/#(\w+)/g, "<a href='https://www.google.com/search?q=%23$1' target='_blank'>$&</a>");

  const getRawContents = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '');

  const getSource = (node: MarkdownAbstractSyntaxTree) => (
    <ReactMarkdown
      {...props}
      source={toHashtag(truncate(raw ? getRawContents(node.value) : node.value, max ?? null))}
    />
  );

  const renderers: ReactMarkdown.Renderers = {
    html: getSource,
    text: getSource,
  };

  return (
    <ReactMarkdown
      className={classes.content}
      renderers={renderers}
      {...props}
    />
  );
};
