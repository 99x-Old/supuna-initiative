import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import Editor from 'components/Editor';
import { Box, InputLabel, Theme } from '@material-ui/core';
import Button from 'components/Elements/Button';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import request from 'services/request';
import config from 'config';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import type { PropsType } from 'types/react.type';
import type { InitiativeType } from 'types/initiative.type';
import type { ResponseType } from 'types/response.type';
import type { ReferenceType } from 'types/html.type';
import AddiInitiative from './AddInitiative';
import AddiEvaluationCriteria from './EvaluationCriteria/EvaluationCriteria';
import Snackbar from '../../Shared/Snackbar';
import Initiative from './Initiative';
import EvaluationCriteria from './EvaluationCriteria';
import SkeletonAny from '../Skeleton/SkeletonAny';
import Confirm from '../../Elements/Confirm';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  content: {
    '& p': {
      margin: '0',
    },
  },
  label: {
    color: theme.palette.secondary.contrastText,
    marginBottom: '10px',
    marginTop: '1rem',
  },
  hide: {
    display: 'none',
  },
}));

export default ({ sub }: PropsType) => {
  const classes = useStyles();
  const history = useHistory();

  const nameRef: ReferenceType = useRef(null);
  const descriptionRef: ReferenceType = useRef(null);
  const addiInitiativeRef: ReferenceType = useRef(null);
  const addiEvaluationCriteriaRef: ReferenceType = useRef(null);
  const snackRef: ReferenceType = useRef(null);
  const initiativesRef: ReferenceType = useRef(null);
  const criteriaRef: ReferenceType = useRef(null);
  const confirmRef: ReferenceType = useRef(null);

  const [loading, setLoading] = useState(false);
  const [initiatives, setInitiative] = useState([]);
  const [criteria, setCriteria] = useState([]);

  const [duration, setDuration]: any = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  });

  const handleAddInitiative = () => {
    addiInitiativeRef.current.open();
  };

  const handleFromChange = (date: Date) => {
    setDuration((currentDuration: any) => ({ ...currentDuration, ...{ from: date } }));
  };
  const handleToChange = (date: Date) => {
    setDuration((currentDuration: any) => ({ ...currentDuration, ...{ to: date } }));
  };
  const getYear = (uuid: string) => {
    setLoading(true);
    request.get(`${config.services.initiative}/initiative-years/${uuid}`)
      .then((response: ResponseType) => {
        nameRef.current.setContents(response.body?.name);
        descriptionRef.current.setContents(response.body?.description);
        setInitiative(response.body.initiatives);
        setCriteria(response.body.evaluationCriteria);
      }).finally(() => {
        setLoading(false);
      });
  };

  const createYear = useCallback(() => {
    setLoading(true);
    const name = nameRef.current.getContents();
    const description = descriptionRef.current.getContents();
    const initiativesData = initiativesRef.current.get();

    request.setContentType('application/json');
    request.post(`${config.services.initiative}/initiative-years`, {
      name, duration, description, initiatives: initiativesData, criteria,
    })
      .then(() => {
        nameRef.current.setContents('');
        descriptionRef.current.setContents('');
        snackRef.current.show('Initiative year has been created!');
        setInitiative([]);
        setCriteria([]);
      }).catch(() => {
        snackRef.current.show('Fill all the values!', { variant: 'error' });
      }).finally(() => {
        setLoading(false);
      });
  }, [criteria, duration]);

  const addInitiativeObjectives = async (initiative: any, objective: string) => {
    request.setContentType('application/json');
    await request
      .put(`${config.services.initiative}/initiatives/set/objective/${initiative.uuid}`, {
        yearId: sub,
        objective,
      })
      .then((memberAddResponse: ResponseType) => {
        // eslint-disable-next-line no-console
        console.log(memberAddResponse);
      });
  };

  const handleEvaluationCriteria = async (evaluationCriteria: any) => {
    setCriteria((currentCriteria: []) => [...currentCriteria, evaluationCriteria]);
  };
  const handleSetInitiative = async (initiative: any) => {
    if (sub) {
      await addInitiativeObjectives(initiative, '');
    }
    setInitiative((currentInitiatives: any[]) => [...currentInitiatives, initiative]);
  };
  const handleAddiEvaluationCriteria = async () => {
    addiEvaluationCriteriaRef.current.open();
  };

  const updateYear = useCallback(() => {
    setLoading(true);
    const name = nameRef.current.getContents();
    const description = descriptionRef.current.getContents();
    const initiativesData = initiativesRef.current.get();

    request.setContentType('application/json');
    request.put(`${config.services.initiative}/initiative-years/${sub}`, {
      name, duration, description, initiatives: initiativesData, criteria,
    })
      .then(() => {
        snackRef.current.show('Initiative year has been updated!');
      }).catch(() => {
        snackRef.current.show('Fill all the values!', { variant: 'error' });
      }).finally(() => {
        setLoading(false);
      });
  }, [criteria, duration, sub]);

  const deleteYear = useCallback(() => {
    const option: any = {
      title: "Are you sure you want to remove this year (This can't be undone) ?",
      confirmText: 'Remove',
    };
    confirmRef
      .current
      .open(true, option, () => () => {
        setLoading(true);

        request.setContentType('application/json');
        return request.delete(`${config.services.initiative}/initiative-years/${sub}`)
          .then(() => {
            history.push('/manage/list-initiative-year');
            nameRef.current.setContents('');
            descriptionRef.current.setContents('');
            setInitiative([]);
          }).catch(() => {

          }).finally(() => {
            setLoading(false);
          });
      });
  }, [history, sub]);

  const onRemoveInitiative = (removedInitiative: InitiativeType) => {
    setInitiative((currentInitiatives: InitiativeType[]) => currentInitiatives
      .filter((initiative: InitiativeType) => initiative.uuid !== removedInitiative.uuid));
  };

  const onRemoveCriteria = (index: number) => {
    setCriteria((currentCriteria: []) => currentCriteria
      .filter((criteriaItem: any, key: number) => key !== index));
  };

  useEffect(() => {
    if (sub) {
      getYear(sub);
    } else {
      nameRef.current.setContents('');
      descriptionRef.current.setContents('');
      setInitiative([]);
    }
  }, [sub]);

  return (
    <>
      {loading && <SkeletonAny />}
      <div className={loading ? classes.hide : ''}>
        <Snackbar ref={snackRef} />
        <AddiInitiative
          ref={addiInitiativeRef}
          onSelect={handleSetInitiative}
        />
        <AddiEvaluationCriteria
          ref={addiEvaluationCriteriaRef}
          onAdd={handleEvaluationCriteria}
        />
        <Confirm ref={confirmRef} />
        <InputLabel className={classes.label}>Name</InputLabel>
        <Editor placeholder={`Initiative ${new Date().getFullYear()}`} ref={nameRef} toolbarHidden />
        <Box mt={1} />
        <InputLabel className={classes.label}>Duration</InputLabel>
        <Box display="flex" flexDirection="row">
          <Box mr={1}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="none"
                format="yyyy/MM/dd"
                value={duration.from}
                onChange={handleFromChange}
                InputProps={{
                  disableUnderline: true,
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="none"
                format="yyyy/MM/dd"
                value={duration.to}
                onChange={handleToChange}
                InputProps={{
                  disableUnderline: true,
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Box>

        <Box mt={1} />
        <InputLabel className={classes.label}>Description</InputLabel>
        <Editor placeholder="Note..." ref={descriptionRef} height="100px" />

        <InputLabel className={classes.label}>
          Evaluation Criteria
          <IconButton className={classes.iconButton} onClick={handleAddiEvaluationCriteria}>
            <AddCircleIcon className={classes.icon} />
          </IconButton>
        </InputLabel>
        <EvaluationCriteria
          criteria={criteria}
          ref={criteriaRef}
          year={sub}
          onRemove={onRemoveCriteria}
        />
        <Box mt={1} />
        {!!sub && (
          <Box mt={1} display="flex" justifyContent="flex-end" m={1} p={1}>
            <Button color="default" onClick={deleteYear} loading={loading} variant="contained">
              Delete
            </Button>
            <Box ml={1} />
            <Button color="primary" onClick={updateYear} loading={loading} variant="contained">
              Update
            </Button>
          </Box>
        )}

        <InputLabel className={classes.label}>
          Initiatives
          <IconButton className={classes.iconButton} onClick={handleAddInitiative}>
            <AddCircleIcon className={classes.icon} />
          </IconButton>
        </InputLabel>
        <Initiative
          initiatives={initiatives}
          ref={initiativesRef}
          onRemoveInitiative={onRemoveInitiative}
          year={sub}
        />
        <Box mt={3} />
        <Box mt={1} display="flex" justifyContent="flex-end" m={1} p={1}>
          {!sub && (
            <Button color="primary" onClick={createYear} loading={loading} variant="contained">
              Create
            </Button>
          )}
        </Box>
      </div>
    </>
  );
};
