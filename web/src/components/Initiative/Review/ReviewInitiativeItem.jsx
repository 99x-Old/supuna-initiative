import React, { useCallback, useEffect, useRef } from 'react';
import {
  AccordionSummary, Box, Card, Slider, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Members from 'components/Elements/Members';
import type { InputType, ReferenceType } from '../../../types/html.type';
import type { PropsType } from '../../../types/react.type';
import Editor from '../../Editor';
import { Button } from '../../Elements';
import UserItem from '../Year/UserItem';
import request from '../../../services/request';
import config from '../../../config';
import type { ResponseType } from '../../../types/response.type';
import Feedback from './Feedback';

const useStyles = makeStyles((theme: Theme) => ({
  item: {},
  card: {
    backgroundColor: theme.palette.secondary.main,
  },
  details: {
    display: 'block',
  },
  iconButton: {
    padding: '5px',
  },
}));
export default ({
  cycle, initiative, evaluationCriteria, criteriaData, contributorsData,
}: PropsType) => {
  const classes = useStyles();

  const noteRef: ReferenceType = useRef({});
  const addContributorRef: ReferenceType = useRef(null);
  const feedbackRef: ReferenceType = useRef(null);

  const [loading, setLoading] = React.useState(false);

  const [ratings, setRatings] = React.useState({});
  const [notes, setNotes] = React.useState({});
  const [contributors, setContributors] = React.useState([]);
  const [contributorsFeedbacks, setContributorsFeedbacks] = React.useState({});

  const handleRating = (criteria: string, point: number) => {
    setRatings((currentRatings: {}) => ({ ...currentRatings, ...{ [criteria]: point } }));
  };

  const handleNotes = async (criteria: string, note: string) => {
    setNotes((currentNotes: {}) => {
      const changeNotes = currentNotes;
      changeNotes[criteria] = note;
      return changeNotes;
    });
  };

  const handleContributors = async (contributor: { }) => {
    feedbackRef.current.open(true, contributor.uuid);
    setContributors((currentContributors: []) => ([...currentContributors, contributor]));
    setContributorsFeedbacks((currentFeedbacks: []) => (
      {
        ...currentFeedbacks,
        [contributor.uuid]: '',
      }));
  };

  const save = () => {
    setLoading(true);
    request.setContentType('application/json');
    request.put(`${config.services.initiative}/initiative-review-cycle/save/initiative/${cycle}/${initiative.uuid}`,
      { ratings, notes, contributors: contributorsFeedbacks })
      .then(() => {

      }).finally(() => {
        setLoading(false);
      });
  };

  const handleAddContributor = () => {
    addContributorRef.current.open();
  };

  const manageContributor = (contributor: any) => {
    feedbackRef.current.open(true, contributor.uuid, contributor);
  };
  const removeContributor = (contributor: any) => {
    setContributors((currentContributors: []) => currentContributors
      .filter((currentContributor: any) => currentContributor.uuid !== contributor.uuid));
    setContributorsFeedbacks((currentFeedbacks: []) => {
      const changedCurrentFeedbacks = currentFeedbacks;
      delete changedCurrentFeedbacks[contributor.uuid];
      return changedCurrentFeedbacks;
    });
  };

  useEffect(() => {
    if (criteriaData) {
      criteriaData.data.map((criteriaDataItem: any) => {
        setRatings((currentRatings: {}) => (
          { ...currentRatings, ...{ [criteriaDataItem.criteria]: criteriaDataItem.points } }
        ));
        // set notes
        setNotes((currentNotes: {}) => (
          { ...currentNotes, ...{ [criteriaDataItem.criteria]: criteriaDataItem.note } }
        ));
        if (noteRef.current[criteriaDataItem.criteria]) {
          noteRef.current[criteriaDataItem.criteria].setContents(criteriaDataItem.note);
        }
        return null;
      });
    }
  }, [criteriaData]);

  const processContributors = useCallback((memberItems: string[]) => {
    const ids = memberItems.map((memberItem: {}) => memberItem.user).join(',');
    if (ids) {
      request
        .get(`${config.services.user}/users/get/list/${ids}`)
        .then((memberResponse: ResponseType) => {
          setContributors(memberResponse.body);

          memberResponse.body
            .map((contributor: any) => setContributorsFeedbacks((currentFeedbacks: []) => (
              {
                ...currentFeedbacks,
                [contributor.uuid]: memberItems
                  .find((memberItem: {}) => memberItem.user === contributor.uuid)?.feedback,
              })));
        });
    }
  }, []);

  useEffect(() => {
    if (contributorsData) {
      processContributors(contributorsData.users);
    }
  }, [contributorsData, processContributors]);

  return (
    <Box className={classes.item} mb={1}>
      <Members
        ref={addContributorRef}
        onSelect={handleContributors}
      />
      <Feedback
        ref={feedbackRef}
        onClickAdd={(contents: string, userId: string) => {
          setContributorsFeedbacks((currentFeedbacks: []) => (
            {
              ...currentFeedbacks,
              [userId]: contents,
            }));
        }}
        onClickRemove={removeContributor}
      />
      <Accordion>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{initiative.name}</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Box>
            {evaluationCriteria.map((criteria: any, cIndex: number) => (
              <Box mb={1} key={cIndex}>
                <Card className={classes.card}>
                  <CardContent>
                    {criteria.criteria}
                    <Slider
                      defaultValue={0}
                      value={ratings[criteria.id] ?? 0}
                      step={5}
                      marks
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      onChange={(e: InputType, point: number) => {
                        handleRating(criteria.id, point);
                      }}
                    />
                    <Editor
                      ref={(el: any) => {
                        noteRef.current[criteria.id] = el;
                      }}
                      height="50px"
                      className="hide"
                      placeholder="Note/Comments..."
                      onTyping={() => handleNotes(
                        criteria.id,
                        noteRef.current[criteria.id].getContents(),
                      )}
                    />
                  </CardContent>
                </Card>
              </Box>
            ))}

            <Box mb={1}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="subtitle1" component="div">
                    Key Contributors
                    <IconButton
                      className={classes.iconButton}
                      onClick={handleAddContributor}
                    >
                      <AddCircleIcon className={classes.icon} />
                    </IconButton>
                  </Typography>
                  {contributors.map((user: any) => (
                    <UserItem
                      key={user.uuid}
                      user={user}
                      memberType={contributorsFeedbacks[user.uuid] ?? ''}
                      onclick={() => manageContributor(user)}
                    />
                  ))}
                </CardContent>
              </Card>
            </Box>

            <Box mb={1} flexDirection="row-reverse" display="flex">
              <Button
                variant="contained"
                color="primary"
                loading={loading}
                onClick={save}
              >
                Save
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
