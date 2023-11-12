import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import StimuliCard from './StimuliCard';
import AddStimuliCard from './AddStimuliCard';
import ExperimentHeader from "./ExperimentHeader";
import {useParams} from "react-router";
import axios from "axios";
import {GET_EXPERIMENT_API, GET_STIMULI_API} from "../projects/BackendEndpoints";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //

const Experiment = () => {
  const {experimentId} = useParams();
  const [stimuliList, setStimuliList] = useState([]);
  const [experimentData, setExperimentData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ID = parseInt(experimentId);
        const experimentResponse = await axios.get(GET_EXPERIMENT_API);
        const {items} = experimentResponse.data;
        const experiment = items.filter((item) => item.id === ID)[0];
        setExperimentData(experiment);

        const stimuliResponse = await axios.get(GET_STIMULI_API, {
          params: {ID},
        });

        const stimuliItems = stimuliResponse.data.items.filter((item) => item.experimentId === ID);
        setStimuliList(stimuliItems);

        setLoading(false);

        console.log(experiment);
        console.log(stimuliList);
      } catch (error) {
        console.error('Error fetching experiment or stimuli data:', error);
        setLoading(false); // Set loading to false even in case of an error
      }
    };

    fetchData();
  }, [experimentId]);

  return (
<<<<<<< HEAD
      <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
        <Grid item xs={12}>
          <ExperimentHeader data={experimentData}/>
=======
    <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
      <Grid item xs={12}>
        <ExperimentHeader/>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <AddVideoCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <VideoCard isLoading={isLoading} />
          </Grid>
>>>>>>> 6482ac1 (Reactions save)
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
