import {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';
import AddProjectCard from "../../ui-component/cards/projects/AddProjectCard";
import ProjectCard from "../../ui-component/cards/projects/ProjectCard";

// ==============================|| PROJECTS DASHBOARD ||============================== //

const Projects = () => {
    const [isLoading, setLoading] = useState(true);
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                // const response = await axios.get(GET_PROJECT_API);
                // const {items} = response.data;
                //
                setProjectList([]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project data:', error.message);
            }
        };

        fetchProjectData();
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <AddProjectCard isLoading={isLoading}/>
            </Grid>
            {projectList && projectList.map((experiment) => (
                <Grid key={experiment.id} item lg={4} md={6} sm={6} xs={12}>
                    <ProjectCard isLoading={isLoading} data={experiment}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default Projects;
