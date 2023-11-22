// project imports
import {Button, Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {GET_PROJECT_BY_ID_API, GET_USERS_API} from "../../endpoints/BackendEndpoints";
import ProjectResearcherHeader from "./ResearcherHeader";
import {useParams} from "react-router";
import UserDataGrid from "../users/UserDataGrid";

// ==============================|| PROJECT RESEARCHERS DASHBOARD ||============================== //


const ProjectResearchers = () => {
    const {projectId} = useParams();

    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [projectData, setProjectData] = useState({});

    useEffect(() => {
        const fetchProjectAndUsers = async () => {
            try {
                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace('{id}', projectId));
                setProjectData(projectResponse.data);

                const usersResponse = await axios.get(GET_USERS_API);
                const {items} = usersResponse.data;
                setUserList(items);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching experiment data:', error.message);
            }
        };

        fetchProjectAndUsers().then();
    }, [projectId]);

    return (
        <>
            <Grid container sx={{mb: 2}}>
                <Grid item xs={12}>
                    <ProjectResearcherHeader data={projectData}/>
                </Grid>
                <Grid item>
                    <Button variant="contained" disableElevation>
                        Add researcher
                    </Button>
                </Grid>
            </Grid>
            {/*TODO change to researcher grid*/}
            <UserDataGrid isLoading={isLoading} userList={userList}/>
        </>
    );
};

export default ProjectResearchers;
