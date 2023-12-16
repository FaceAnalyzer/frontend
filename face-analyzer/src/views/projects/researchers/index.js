// project imports
import {Button, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    GET_PROJECT_BY_ID_API,
    GET_RESEARCHERS_API,
    GET_USERS_BY_PROJECT_ID_API
} from "../../../endpoints/BackendEndpoints";
import ProjectResearcherHeader from "../../../ui-component/headers/ResearcherHeader";
import {Navigate, useParams} from "react-router";
import ResearcherDataGrid from "./ResearcherDataGrid";
import AddUserToProjectModal from "../../../ui-component/modals/projects/researchers/AddUserToProjectModal";
import {useAuth} from "../../../context/authContext";

// ==============================|| PROJECT RESEARCHERS DASHBOARD ||============================== //


const ProjectResearchers = () => {
    const {projectId} = useParams();

    const [isLoading, setLoading] = useState(true);
    const [usersOnProjectList, setUsersOnProjectList] = useState([]);
    const [usersNotOnProjectList, setUsersNotOnProjectList] = useState([]);
    const [projectData, setProjectData] = useState({});

    const [showModal, setShowModal] = useState(false);
    const {user} = useAuth();
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const fetchProjectAndUsers = async () => {
            try {
                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace('{id}', projectId));
                setProjectData(projectResponse.data);

                const usersOnProjectResponse = await axios.get(GET_USERS_BY_PROJECT_ID_API.replace('{id}', projectId));
                const usersOnProjectItems = usersOnProjectResponse.data.items;
                setUsersOnProjectList(usersOnProjectItems);

                const allUsersResponse = await axios.get(GET_RESEARCHERS_API);
                const allUsers = allUsersResponse.data.items;

                const usersNotOnProject = allUsers.filter(user => !usersOnProjectItems.some(projectUser => projectUser.id === user.id));

                setUsersNotOnProjectList(usersNotOnProject);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching experiment data:', error.message);
            }
        };

        fetchProjectAndUsers().then();
    }, [projectId]);

    console.log(usersNotOnProjectList);

    return !user ? (<Navigate to="/login" replace/>) : (
        <>
            <AddUserToProjectModal showModal={showModal}
                                   closeModal={closeModal}
                                   projectData={projectData}
                                   usersNotOnProjectData={usersNotOnProjectList}/>
            <Grid container sx={{mb: 2}}>
                <Grid item xs={12}>
                    <ProjectResearcherHeader data={projectData}/>
                </Grid>
                <Grid item>
                    <Button id={"button-add-researcher"} variant="contained" disableElevation onClick={openModal}>
                        Add researcher
                    </Button>
                </Grid>
            </Grid>
            <ResearcherDataGrid isLoading={isLoading} userList={usersOnProjectList} projectData={projectData}/>
        </>
    );
};

export default ProjectResearchers;
