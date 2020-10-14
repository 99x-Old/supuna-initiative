import React, { useEffect, useState } from 'react';
import { Box, Theme, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import request from 'services/request';
import config from 'config';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import type { ProfileType } from 'types/profile.type';
import Section from './Section';
import Kudos from './Kudos';
import Initiatives from './Initiatives';
import Actions from './Actions';

const TabPanel = (props: any) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div {...other}>
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
};

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

type PropsType = {
  tab: number,
  profile: ProfileType,
  sameUser: boolean
};

export default ({ profile, tab, sameUser }: PropsType) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabs] = useState(['about', 'connection', 'kudos', 'actions']);
  const [, setSections] = useState([]);
  const history = useHistory();

  const onChangeTab = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  useEffect(() => {
    onChangeTab(tabs.indexOf(tab) === -1 ? 0 : tabs.indexOf(tab));
  }, [tab, tabs]);

  const changeTabs = (event: any, tabIndex: number) => {
    if (tabIndex !== null) {
      history.push(`/profile/${profile.uuid}/${tabs[tabIndex]}`);
      onChangeTab(tabIndex);
    }
  };
  useEffect(() => {
    const params = { userId: profile.uuid };
    request.get(`${config.services.user}/sections`, { params })
      .then((response: ResponseType) => {
        setSections(response.body);
      });
  }, [profile.uuid]);

  return (
    <div>
      <Box mt={1}>
        <StyledToggleButtonGroup
          size="small"
          value={selectedTab}
          exclusive
          onChange={changeTabs}
          aria-label="text alignment"
        >
          <ToggleButton value={0} aria-label="left aligned">
            About
          </ToggleButton>
          <ToggleButton value={1} aria-label="centered">
            Initiatives
          </ToggleButton>
          <ToggleButton value={2} aria-label="centered">
            Kudos
          </ToggleButton>
          <ToggleButton value={3} aria-label="centered">
            Actions
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <Box p={1} m={1}>
          <Section
            editable={sameUser}
            name="bio"
            contents={{
              title: {
                readonly: true,
                text: 'Bio',
              },
              text: profile.bio.length ? profile.bio : 'Your bio goes here',
            }}
          />
        </Box>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Initiatives userId={profile.uuid} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <Kudos userId={profile.uuid} />
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        <Actions userId={profile.uuid} />
      </TabPanel>
    </div>

  );
};
