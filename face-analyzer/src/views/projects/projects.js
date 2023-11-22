import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';
import AddProjectCard from "../../ui-component/cards/projects/AddProjectCard";
import ProjectCard from "../../ui-component/cards/projects/ProjectCard";
import {GET_PROJECTS_API} from "../../endpoints/BackendEndpoints";
import axios from "axios";
import ProjectManagementHeader from "./ProjectManagementHeader";

// ==============================|| PROJECTS DASHBOARD ||============================== //

const Projects = () => {
    const [isLoading, setLoading] = useState(true);
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(GET_PROJECTS_API);
                const {items} = response.data;
                setProjectList(items);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching project data:', error.message);
            }
        };

        fetchProjectData();
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <ProjectManagementHeader/>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <AddProjectCard isLoading={isLoading}/>
            </Grid>
            {projectList && projectList.map((project) => (
                <Grid key={project.id} item lg={4} md={6} sm={6} xs={12}>
                    <ProjectCard isLoading={isLoading} data={project}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default Projects;
