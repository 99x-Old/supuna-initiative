import React, { Suspense, useCallback, useEffect } from 'react';
import { Box, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import Skeleton from './Skeleton';
import CreateYear from './Year/Create';
import YearList from './Year/List';
import ManageUsers from './ManageUsers';
import CreateInitiatives from './CreateInitiatives';
import ListInitiatives from './ListInitiatives';
import CreateDepartments from './CreateDepartment';
import ListDepartments from './ListDepartment';
import Review from './Review';
import Guard from '../Sytem/Guard';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    '& input': {
      paddingLeft: '0 !important;',
      fontSize: theme.typography.h6.fontSize,
    },
  },
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  divider: {
    marginTop: 6,
  },
}));

type PropsType = {
    match: { params: { main: string, sub: string } }
};

export default (props: PropsType) => {
  const classes = useStyles();
  const history = useHistory();
  const { match }: any = props;

  const [selectedMenu, setSelectedMenu] = React.useState('');
  const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);
  const [, setSelectedHeader] = React.useState('Users');
  const [loading] = React.useState(false);

  const onMenuSelect = useCallback((header: string, menu: string) => {
    setSelectedHeader(header);
    setSelectedSubMenu(null);
    setSelectedMenu(menu);
    history.push(`/manage/${menu}`);
  }, [history]);

  useEffect(() => {
    const { main, sub } = match.params;
    if (main) {
      setSelectedMenu(main);
      if (sub) {
        setSelectedSubMenu(sub);
      }
    } else {
      setSelectedMenu('list-initiative-year');
    }
  }, [match.params]);

  return (
    <Suspense fallback={<Skeleton />}>
      <Grid container spacing={3}>
        <Grid item md={3}>
          <List component="nav">
            <Guard>
              <ListSubheader>Users</ListSubheader>
              <ListItem
                selected={selectedMenu === 'manage-users'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Users', 'manage-users')}
              >
                <ListItemText primary="Manage Users" />
              </ListItem>
              <Divider className={classes.divider} />
              <ListSubheader>Newsletters</ListSubheader>
              <ListItem
                selected={selectedMenu === 'list-newsletters'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Newsletters', 'list-newsletters')}
              >
                <ListItemText primary="List" />
              </ListItem>
              <Divider className={classes.divider} />

              <ListSubheader>Initiatives</ListSubheader>
              <ListItem
                selected={selectedMenu === 'create-initiative'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Initiatives', 'create-initiative')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">Create</Typography>)}
                />
              </ListItem>
              <ListItem
                selected={selectedMenu === 'list-initiative'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Initiatives', 'list-initiative')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">List</Typography>)}
                />
              </ListItem>
              <Divider className={classes.divider} />
              <ListSubheader>Departments</ListSubheader>
              <ListItem
                selected={selectedMenu === 'create-department'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Departments', 'create-department')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">Create</Typography>)}
                />
              </ListItem>

              <ListItem
                selected={selectedMenu === 'list-department'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Departments', 'list-department')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">List</Typography>)}
                />
              </ListItem>
            </Guard>

            <Divider className={classes.divider} />
            <ListSubheader>Year</ListSubheader>
            <Guard requiredPermission="create-initiative-year">
              <ListItem
                selected={selectedMenu === 'create-initiative-year'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Initiatives', 'create-initiative-year')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">Create</Typography>)}
                />
              </ListItem>
              <ListItem
                selected={selectedMenu === 'list-initiative-year'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Initiatives', 'list-initiative-year')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">List</Typography>)}
                />
              </ListItem>
            </Guard>
            <Guard requiredPermission="create-review-cycle">
              <ListItem
                selected={selectedMenu === 'review-cycle'}
                button
                className={classes.listItem}
                onClick={() => onMenuSelect('Initiatives', 'review-cycle')}
              >
                <ListItemText
                  primary={(<Typography noWrap type="body2">Review</Typography>)}
                />
              </ListItem>
            </Guard>
          </List>
        </Grid>
        <Grid item md={9}>
          <Box ml={5} className={classes.content}>
            {!loading && (
            <Typography component="div" paragraph>
              <Box mt={3} />
              {selectedMenu === 'manage-users' && <ManageUsers sub={selectedSubMenu} />}
              {selectedMenu === 'list-newsletters' && <div>NewsLetter</div>}
              {selectedMenu === 'create-initiative' && <CreateInitiatives sub={selectedSubMenu} />}
              {selectedMenu === 'list-initiative' && <ListInitiatives sub={selectedSubMenu} />}
              {selectedMenu === 'create-department' && <CreateDepartments sub={selectedSubMenu} />}
              {selectedMenu === 'list-department' && <ListDepartments sub={selectedSubMenu} />}
              {selectedMenu === 'create-initiative-year' && <CreateYear sub={selectedSubMenu} />}
              {selectedMenu === 'list-initiative-year' && <YearList sub={selectedSubMenu} />}
              {selectedMenu === 'review-cycle' && <Review sub={selectedSubMenu} />}
            </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Suspense>
  );
};
