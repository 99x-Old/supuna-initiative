import React, { forwardRef, useImperativeHandle } from 'react';
import { Box } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import ProgressLiner from '../../../Elements/ProgressLiner';

const useStyles = makeStyles(() => ({
  root: {
    width: '30%',
    marginRight: '1rem',
    marginBottom: '1rem',
  },
  body: {
    height: '80px',
    overflow: 'hidden',
  },
  criteriaRemove: {
    position: 'absolute',
    marginLeft: '-1rem',
    marginTop: '-1rem',
  },

}));
type PropsType = {
    criteria: any[],
    onRemove: any
};
export default forwardRef(({ criteria, onRemove }: PropsType, ref: any) => {
  const classes = useStyles();

  const onRemoveHandle = async (index: number) => {
    if (onRemove) {
      onRemove(index);
    }
  };
  useImperativeHandle(ref, () => ({}));

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap">
      {criteria.map((criteriaItem: any, index: number) => (
        <Card className={classes.root} key={index}>
          <IconButton
            size="small"
            color="default"
            className={classes.criteriaRemove}
            onClick={() => onRemoveHandle(index)}
          >
            <HighlightOffIcon />
          </IconButton>
          <CardContent>
            <Typography
              variant="body2"
              component="div"
              className={classes.body}
              title={criteriaItem.criteria}
            >
              {criteriaItem.criteria}
            </Typography>
            <ProgressLiner progress={criteriaItem.weight} />
          </CardContent>
          <CardActions>
            <Typography className={classes.title} color="textSecondary" component="div">
              <Box display="flex">
                <Box flexGrow={1} />
                <Box />
              </Box>
            </Typography>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
});
