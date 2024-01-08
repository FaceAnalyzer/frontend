import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';
import AddProjectCard from "../../ui-component/cards/projects/AddProjectCard";
import ProjectCard from "../../ui-component/cards/projects/ProjectCard";
import {GET_PROJECTS_API} from "../../endpoints/BackendEndpoints";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import ProjectManagementHeader from "../../ui-component/headers/ProjectManagementHeader";
import {useAuth} from "../../context/authContext";

// ==============================|| PROJECTS DASHBOARD ||============================== //

const Projects = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [projectList, setProjectList] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(GET_PROJECTS_API);
                const {items} = response.data;
                setProjectList(items.reverse()); //reverse so newest projects are shown first

                setLoading(false);
            } catch (error) {
                console.error('Error fetching project data:', error.message);
            }
        };

        if (user) {
            fetchProjectData().then();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    return !user ? (
        <></>
    ) : (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <ProjectManagementHeader/>
            </Grid>
            {user.role === 'Admin' && (
                <Grid item lg={4} md={6} sm={6} xs={12}>
                    <AddProjectCard isLoading={isLoading}/>
                </Grid>
            )}
            {projectList &&
                projectList.map((project) => (
                    <Grid key={project.id} item lg={4} md={6} sm={6} xs={12}>
                        <ProjectCard isLoading={isLoading} data={project}/>
                    </Grid>
                ))}
        </Grid>
    );
};

export default Projects;
