import {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import ExperimentCard from './ExperimentCard';
import AddExperimentCard from './AddExperimentCard';
import axios from "axios";
import {GET_EXPERIMENT_API} from "./BackendEndpoints";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //

const Experiments = () => {
  const [isLoading, setLoading] = useState(true);
  const [experimentList, setExperimentList] = useState([]);

  useEffect(() => {
    const fetchExperimentData = async () => {
      try {
        const response = await axios.get(GET_EXPERIMENT_API);
        const {items} = response.data;

        // Filter items where projectId is 1
        const filteredExperimentList = items.filter((item) => item.projectId === 1);
        console.log('Experiment List:', filteredExperimentList);

        setExperimentList(filteredExperimentList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experiment data:', error.message);
      }
    };

    fetchExperimentData();
  }, []);


  return (
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} sm={6} xs={12}>
          <AddExperimentCard isLoading={isLoading}/>
        </Grid>
        {experimentList && experimentList.map((experiment) => (
            <Grid key={experiment.id} item lg={4} md={6} sm={6} xs={12}>
              <ExperimentCard isLoading={isLoading} data={experiment}/>
            </Grid>
        ))}
      </Grid>
  );
};

export default Experiments;
