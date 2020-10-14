import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import { Box, Divider, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Viewer from '../../Elements/Viewer';
import request from '../../../services/request';
import config from '../../../config';
import Skeleton from '../Skeleton/SkeletonList';

const useStyles = makeStyles(() => ({
  root: {
    height: 190,
    cursor: 'pointer',
  },
  title: {
    fontSize: 14,
    width: '100%',
  },
  manageIcon: {
    padding: 4,
    display: 'inline-block',
  },
  body: {
    height: '60px',
    overflow: 'hidden',
  },
  name: {
    display: 'inline-block',
    '& p': {
      margin: '0',
      marginBottom: '0.5rem',
    },
  },
  description: {
    height: '20px',
  },
  done: {
    verticalAlign: 'middle',
    fontSize: '1rem',
    color: 'green',
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState([]);

  const listInitiative = useCallback(() => {
    request.setContentType('application/json');
    setLoading(true);
    request.get(`${config.services.initiative}/initiative-review-cycle`)
      .then((response: ResponseType) => {
        setList(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    listInitiative();
  }, [listInitiative]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Box>
      <Grid container spacing={1}>
        {list.map((cycle: any, index: number) => (
          <Grid item xs={6} key={index}>
            <Card
              className={classes.root}
              onClick={(e: any) => {
                e.preventDefault();
                history.push(`/manage/review-cycle/${cycle.uuid}`);
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  <Viewer escapeHtml={false} source={cycle.title} className={classes.name} />
                </Typography>
                <Typography variant="body2" component="div" className={classes.body} title={cycle.description}>
                  <Viewer
                    escapeHtml={false}
                    source={cycle.description}
                  />
                </Typography>
                <Box m={1}>
                  <Divider />
                </Box>
                <Typography variant="body2" component="div" color="textSecondary" title={cycle.description}>
                  <Box display="flex">
                    <Box mr={1}>
                      From:
                      {' '}
                      {moment.utc(cycle.duration.from).format('YYYY-MM-DD')}
                    </Box>
                    <Box mr={1}>
                      To:
                      {' '}
                      {moment.utc(cycle.duration.to).format('YYYY-MM-DD')}
                    </Box>
                  </Box>
                </Typography>
                <Typography variant="body2" component="div" color="textSecondary" title={cycle.description}>
                  Status:
                  {cycle.done ? ' Done' : ' In Progress'}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography className={classes.title} color="textSecondary" component="div">
                  <Box display="flex" />
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
