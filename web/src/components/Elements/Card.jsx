import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import type { PropsType } from 'types/react.type';
import {
  Card, CardActionArea, CardContent, CardMedia, Theme, Typography,
} from '@material-ui/core';

const useStyles = (props: any) => makeStyles((theme: Theme) => ({
  media: {
    height: 220,
  },
  card: {
    width: props.width ?? 210,
    display: 'inline-block',
    marginRight: '5px',

  },
  content: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    textAlign: 'center',
    padding: '10px',
  },
  text: {
    fontSize: '1.1rem',

  },
}));

export default ({
  onClick, title, description, image, width,
}: PropsType) => {
  const classes = useStyles({ width })();

  return (
    <Card
      className={classes.card}
      onClick={onClick}
      title={description}
    >
      <CardActionArea>
        {image !== false && (
        <CardMedia
          className={classes.media}
          image={image}
        />
        )}
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="body1" noWrap className={classes.text}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
