import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import StimuliCard from '../../ui-component/cards/experiments/StimuliCard';
import AddStimuliCard from '../../ui-component/cards/experiments/AddStimuliCard';
import ExperimentHeader from "../../ui-component/headers/ExperimentHeader";
import {useParams} from "react-router";
import axios from "axios";
import {GET_EXPERIMENT_BY_ID_API, GET_PROJECT_BY_ID_API, GET_STIMULI_API} from "../../endpoints/BackendEndpoints";
import {useAuth} from "../../context/authContext";
import {useNavigate} from "react-router-dom";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //

const Experiment = () => {
  const navigate = useNavigate();
  const {experimentId} = useParams();
  const [stimuliList, setStimuliList] = useState([]);
  const [experimentData, setExperimentData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ID = parseInt(experimentId);
        const experimentResponse = await axios.get(GET_EXPERIMENT_BY_ID_API.replace("{id}", experimentId));
        const experiment = experimentResponse.data;
        setExperimentData(experiment);

        const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace("{id}", experiment.projectId));
        setProjectData(projectResponse.data);

        const stimuliResponse = await axios.get(GET_STIMULI_API, {
          params: {ID},
        });

        const stimuliItems = stimuliResponse.data.items;
        setStimuliList(stimuliItems.reverse()); //reverse so newest stimuli are shown first

        setLoading(false);
      } catch (error) {
        console.error('Error fetching experiment or stimuli data:', error);
        setLoading(false); // Set loading to false even in case of an error
      }
    };

    if (user) {
      fetchData().then();
    } else {
      navigate('/login');
    }

  }, [experimentId, user, navigate]);

  return !user ? (
      <></>
  ) : (
      <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
        <Grid item xs={12}>
          <ExperimentHeader data={experimentData} projectData={projectData}/>
        </Grid>
        <Grid item lg={4} md={6} sm={6} xs={12}>
          <AddStimuliCard isLoading={isLoading} experimentId={experimentId}/>
        </Grid>
        {stimuliList && stimuliList.map((stimulus) => (
            <Grid item key={stimulus.id} lg={4} md={6} sm={6} xs={12}>
              <StimuliCard isLoading={isLoading} data={stimulus}/>
            </Grid>
        ))}
      </Grid>
  );
};

export default Experiment;
