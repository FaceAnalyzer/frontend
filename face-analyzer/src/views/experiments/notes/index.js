import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import {useParams} from "react-router";
import axios from "axios";
import {
    GET_EXPERIMENT_BY_ID_API,
    GET_NOTES_BY_EXPERIMENT_ID_API,
    GET_PROJECT_BY_ID_API
} from "../../../endpoints/BackendEndpoints";
import NotesHeader from "../../../ui-component/headers/NotesHeader";
import AddNoteCard from "../../../ui-component/cards/experiments/notes/AddNoteCard";
import NoteCard from "../../../ui-component/cards/experiments/notes/NoteCard";
import {useAuth} from "../../../context/authContext";
import {useNavigate} from "react-router-dom";

// ==============================|| NOTES DASHBOARD ||============================== //

const Notes = () => {
    const navigate = useNavigate();
    const {experimentId} = useParams();
    const [notesList, setNotesList] = useState([]);
    const [experimentData, setExperimentData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const experimentResponse = await axios.get(GET_EXPERIMENT_BY_ID_API.replace("{id}", experimentId));
                const experiment = experimentResponse.data;
                setExperimentData(experiment);

                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace("{id}", experiment.projectId));
                setProjectData(projectResponse.data);

                const notesResponse = await axios.get(GET_NOTES_BY_EXPERIMENT_ID_API.replace("{id}", experimentId));
                const {items} = notesResponse.data;
                setNotesList(items.reverse()); //reverse so newest notes are shown first

                setLoading(false);
            } catch (error) {
                console.error('Error fetching project, experiment or notes data:', error);
                setLoading(false);
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
                <NotesHeader experiment={experimentData} project={projectData}/>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
                <AddNoteCard isLoading={isLoading} experimentId={experimentId}/>
            </Grid>
            {notesList && notesList.map((note) => (
                <Grid item key={note.id} lg={4} md={6} sm={6} xs={12}>
                    <NoteCard isLoading={isLoading} data={note}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default Notes;
