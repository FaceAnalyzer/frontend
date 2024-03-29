import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import ExperimentCard from '../../ui-component/cards/projects/ExperimentCard';
import AddExperimentCard from '../../ui-component/cards/projects/AddExperimentCard';
import axios from "axios";
import {GET_EXPERIMENTS_BY_PROJECT_ID_API, GET_PROJECT_BY_ID_API} from "../../endpoints/BackendEndpoints";
import {gridSpacing} from "../../store/constant";
import ProjectHeader from "../../ui-component/headers/ProjectHeader";
import {useParams} from "react-router";
import {useAuth} from "../../context/authContext";
import {useNavigate} from "react-router-dom";

// ==============================|| EXPERIMENTS DASHBOARD ||============================== //

const Experiments = () => {
  const navigate = useNavigate();
  const {projectId} = useParams();
  const ID = parseInt(projectId);

  const [isLoading, setLoading] = useState(true);

  const [experimentList, setExperimentList] = useState([]);
  const [projectData, setProjectData] = useState({});
  const {user} = useAuth();

  useEffect(() => {
    const fetchExperimentData = async () => {
      try {
        const experimentResponse = await axios.get(GET_EXPERIMENTS_BY_PROJECT_ID_API.replace("{id}", projectId));
        const fetchedExperiments = experimentResponse.data.items;

        const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace("{id}", projectId));
        const fetchedProject = projectResponse.data;

        setExperimentList(fetchedExperiments.reverse()); //reverse so newest experiments are shown first
        setProjectData(fetchedProject);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experiment data:', error.message);
      }
    };

    if (user) {
      fetchExperimentData().then();
    } else {
      navigate('/login');
    }

  }, [projectId, navigate, user]);


  return !user ? (
      <></>
  ) : (
      <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
        <Grid item xs={12}>
          <ProjectHeader data={projectData}/>
        </Grid>
        <Grid item lg={4} md={6} sm={6} xs={12}>
          <AddExperimentCard isLoading={isLoading} projectId={ID}/>
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
