import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import Editor from 'components/Editor';
import { Box, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ReactMarkdown from 'react-markdown';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Members from 'components/Elements/Members';
import request from 'services/request';
import config from 'config';
import Confirm from 'components/Elements/Confirm';
import Button from 'components/Elements/Button';
import Snack from 'components/Alerts/Snack';
import type { ReferenceType } from 'types/html.type';
import UserItem from '../UserItem';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  content: {
    '& p': {
      margin: '0',
    },
  },
  addMember: {
    display: 'inline-block',
  },
  iconButton: {
    padding: '5px',
  },
}));

type PropsType = {
    initiative: any,
    year: string,
    onRemoveInitiative: any
};
export default forwardRef(({ initiative, year, onRemoveInitiative }: PropsType, ref: any) => {
  const classes = useStyles();

  const addiMemberRef: any = useRef(null);
  const descriptionRef: any = useRef(null);
  const confirmRef: ReferenceType = useRef(null);
  const alertRef: ReferenceType = useRef(null);

  const [members, setMembers] = useState([]);

  const getInitiative = () => {
    const note = descriptionRef.current.getContents();

    const memberData = members.map((member: any) => ({
      memberType: member.memberType,
      user: member.user.uuid,
    }));
    return { memberData, note, initiative: initiative.uuid };
  };

  const handleAddMember = () => {
    addiMemberRef.current.open();
  };

  const handleSetMember = async (member: any) => {
    if (year) {
      request.setContentType('application/json');
      await request
        .put(`${config.services.initiative}/initiatives/set/members/${initiative.uuid}`, {
          memberId: member.uuid,
          yearId: year,
          memberType: 'lead',
        })
        .then((memberAddResponse: ResponseType) => {
          // eslint-disable-next-line no-console
          console.log(memberAddResponse);
        });
    }
    setMembers((currentMembers: any[]) => [...currentMembers, {
      memberType: 'lead',
      user: member,
    }]);
  };

  const saveNotes = async (note: string) => {
    if (year) {
      request.setContentType('application/json');
      await request
        .put(`${config.services.initiative}/initiative-years/initiative/notes/${initiative.uuid}/${year}`, { note })
        .then(() => {
          alertRef.current.showAlert('Initiative has been saved!');
        });
    }
  };

  const removeInitiative = async () => {
    const option: any = {
      title: 'Are you sure you want to remove this initiative ?',
      confirmText: 'Remove',
    };
    confirmRef
      .current
      .open(true, option, () => () => {
        if (year) {
          request.setContentType('application/json');
          return request
            .delete(`${config.services.initiative}/initiative-years/initiative/${initiative.uuid}/${year}`)
            .then(() => {
              if (onRemoveInitiative) {
                onRemoveInitiative(initiative);
              }
            });
        }
        return null;
      });
  };

  const processMembers = useCallback((memberItems: string[]) => {
    const ids = memberItems.map((memberItem: {}) => memberItem.user);
    request
      .get(`${config.services.user}/users/get/list/${ids.join(',')}`)
      .then((memberResponse: ResponseType) => {
        const userDetails = memberResponse.body.map((userDetail: any, index: number) => ({
          memberType: memberItems[index].type,
          user: userDetail,
        }));
        setMembers(userDetails);
      });
  }, []);

  const removeMember = (userId: number) => {
    const option: any = {
      title: 'Are you sure you want to remove this user ?',
      confirmText: 'Remove',
    };
    confirmRef
      .current
      .open(true, option, () => () => {
        request.setContentType('application/json');
        return request.delete(`${config.services.initiative}/initiatives/leave/${initiative.uuid}/${userId}`)
          .then(() => {
            setMembers((currentMembers: any) => currentMembers
              .filter((member: any) => member.user.uuid !== userId));
          });
      });
  };

  useEffect(() => {
    if (initiative.members?.length) {
      processMembers(initiative.members);
    }
  }, [initiative.members, processMembers]);

  useImperativeHandle(ref, () => ({
    getInitiative,
  }));

  return (
    <>
      <Members
        ref={addiMemberRef}
        onSelect={handleSetMember}
      />
      <Confirm ref={confirmRef} />
      <Snack ref={alertRef} />
      <Box p={2}>
        <Grid container>
          <Grid item md={12}>
            <Box mb={1}>
              <Box display="flex" flexDirection="row">
                <Box ml={1}>
                  <Typography variant="h6" display="block" gutterBottom>
                    {initiative.name}
                  </Typography>
                  <Typography variant="body2" display="block" component="div" gutterBottom>
                    <ReactMarkdown
                      className={classes.content}
                      escapeHtml={false}
                      source={initiative.description}
                    />
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={12}>
            <Editor
              contents={initiative.objective}
              placeholder="Note/Objectives"
              ref={descriptionRef}
              height="100px"
            />
          </Grid>

          <small>
            Members
            <IconButton className={classes.iconButton} onClick={handleAddMember}>
              <AddCircleIcon className={classes.icon} />
            </IconButton>
          </small>
          <Grid item md={12}>
            {members.map((member: any) => (
              <UserItem
                key={member.user.uuid}
                user={member.user}
                memberType={member.memberType}
                onclick={() => removeMember(member.user.uuid)}
              />
            ))}

            {year && (
            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={removeInitiative}
                size="small"
                color="default"
                variant="contained"
                className={classes.buttonExtraSmall}
              >
                Remove
              </Button>
              <Box ml={1} />
              <Button
                onClick={() => saveNotes(descriptionRef.current.getContents())}
                size="small"
                color="primary"
                variant="contained"
                className={classes.buttonExtraSmall}
              >
                Save
              </Button>

            </Box>
            )}
          </Grid>
        </Grid>
      </Box>

    </>
  );
});
