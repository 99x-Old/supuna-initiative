import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Box } from '@material-ui/core';
import request from 'services/request';
import config from 'config';
import type { PropsType } from 'types/react.type';
import UserItem from '../Year/UserItem';
import SkeletonUsers from '../Skeleton/SkeletonUsers';
import { Button } from '../../Elements';
import Guard from '../../Sytem/Guard';
import type { ReferenceType } from '../../../types/html.type';
import Members from '../../Elements/Members';
import ManageMembers from './Elements/ManageMembers';

export default ({ initiativeId }: PropsType) => {
  const [members, setMembers] = useState([]);
  const [usersDetails, setUsersDetails] = useState([]);
  const [loading, setLoading] = React.useState(false);

  const addMemberRef: ReferenceType = useRef(null);
  const manageMemberRef: ReferenceType = useRef(null);

  const getInitiativeMembers = useCallback((id: string) => {
    setLoading(true);
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives/get/members/${id}`)
      .then((response: ResponseType) => {
        setMembers(response.body);
        setLoading(false);
      });
  }, []);

  const processMembers = useCallback(async (memberItems: string[]) => {
    setLoading(true);
    const ids = memberItems.map((memberItem: {}) => memberItem.users)
      .flat()
      .map((userItem: any) => (userItem.userId));

    const membersDetails = await request
      .get(`${config.services.user}/users/get/list/${ids.join(',')}`)
      .then((memberResponse: ResponseType) => memberResponse.body)
      .finally(() => { setLoading(false); });
    setUsersDetails(membersDetails);
  }, []);

  const getUserDetails = useCallback((id: string) => usersDetails
    .find((detailsItem: any) => detailsItem.uuid === id), [usersDetails]);

  const handleMember = (user: any) => {
    if (manageMemberRef.current) {
      manageMemberRef.current.open(user.userId);
    }
  };

  const handleSetMember = (selectedMember: any) => {
    request.setContentType('application/json');
    setLoading(true);
    request.post(`${config.services.initiative}/initiatives/join/${initiativeId}`, {
      userId: selectedMember.uuid,
    })
      .then(() => {
        setLoading(true);
        getInitiativeMembers(initiativeId);
      }).finally(() => {
        setLoading(false);
      });
  };
  const handleSelectMember = async () => {
    addMemberRef.current.open(true);
  };
  const onKick = async () => {
    getInitiativeMembers(initiativeId);
  };

  useEffect(() => {
    getInitiativeMembers(initiativeId);
  }, [getInitiativeMembers, initiativeId]);

  useEffect(() => {
    if (members?.length) {
      processMembers(members).then();
    }
  }, [members, processMembers]);

  if (loading) {
    return <SkeletonUsers />;
  }
  return (
    <Box>
      <ManageMembers
        ref={manageMemberRef}
        onAdd={handleSetMember}
        onKick={onKick}
        initiativeId={initiativeId}
      />

      <Guard requiredPermission="add-user-initiative">
        <Members
          ref={addMemberRef}
          onSelect={handleSetMember}
        />
        <Button color="primary" variant="contained" onClick={handleSelectMember}>Add Member</Button>
      </Guard>
      {!!usersDetails.length && members.map((item: any, yearIndex: number) => (
        <div key={yearIndex}>
          <Box mt={1} />
          {item.users.map((member: any, index: number) => (
            <UserItem
              key={index}
              user={getUserDetails(member.userId)}
              memberType={member.memberType}
              size={8}
              onclick={() => handleMember(member)}
            />
          ))}
        </div>
      ))}
    </Box>
  );
};
