import React, {useEffect, useRef, useState} from 'react';

// material-ui
import {Box, Button, Grid, Typography} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import {useParams} from "react-router";
import axios from "axios";
import {GET_EXPERIMENT_BY_ID_API, GET_PROJECT_BY_ID_API, GET_STIMULI_BY_ID_API} from "../../endpoints/BackendEndpoints";
import StimuliHeader from "../../ui-component/headers/StimuliHeader";
import WebcamComponent from "../reactions/WebcamComponent";
import VisageProcessing from "../reactions/VisageProcessing";
import AnalysisResultsComponent from "../reactions/AnalysisResultsComponent";
import {AnalysisDataContext} from "../reactions/AnalysisDataContext";
import {Videocam, VideocamOff} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import ReactionsContent from "./ReactionsContent";
import SaveReactionModal from "../../ui-component/modals/stimuli/SaveReactionModal";
import {useAuth} from "../../context/authContext";
import {useNavigate} from "react-router-dom";

// ==============================|| STIMULUS DASHBOARD ||============================== //

const Stimuli = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const {stimuliId} = useParams();
    const [stimuliData, setStimuliData] = useState({});
    const [experimentData, setExperimentData] = useState({});
    const [projectData, setProjectData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const {user} = useAuth();

    const id = parseInt(stimuliId);

    const parseYoutubeLink = (link) => {
        const videoIdMatch = link.match(/(?:v=|\/)([\w-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if(videoId) {
            return [`https://www.youtube.com/embed/${videoId}`, videoId];
        }
        else{
            console.error("Invalid link:", link);
        }
    }

    useEffect(() => {
        //Clear potential existing data in localStorage
        const clearLocalStorageData = () => {
            localStorage.removeItem("analysisData");
        }
        const fetchData = async () => {
            try {
                const stimuliResponse = await axios.get(GET_STIMULI_BY_ID_API.replace('{id}', stimuliId));
                const items = stimuliResponse.data;
                //TODO: how to do this in a more consistent way?

                const [link, videoId] = parseYoutubeLink(items.link);
                items.link = link;
                items.videoId = videoId;

                setStimuliData(items);

                const experimentResponse = await axios.get(GET_EXPERIMENT_BY_ID_API.replace("{id}", items.experimentId));
                const experimentItem = experimentResponse.data;
                setExperimentData(experimentItem);

                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace("{id}", experimentItem.projectId));
                const projectItem = projectResponse.data;
                setProjectData(projectItem);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching stimuli data:', error);
                setLoading(false); // Set loading to false even in case of an error
            }
        };

        if (user) {
            clearLocalStorageData();
            fetchData().then();
        } else {
            navigate("/login");
        }

        return() => {
            clearLocalStorageData();
        }
    }, [stimuliId, navigate, user]);

    useEffect(() => {
        if(!localStorage.getItem("analysisData")){
            console.log("No LS data exists. Save disabled.");
            setSaveDisabled(true);
        }
        else{
            setSaveDisabled(false);
        }
        // eslint-disable-next-line
    }, [localStorage.getItem("analysisData")]);

    const toggleRecording = () => {
        if(!isRecording){
            setStimuliData({...stimuliData, link: (stimuliData.link + "?autoplay=1")});
        }
        else{
            setStimuliData({...stimuliData, link: (stimuliData.link.replace("?autoplay=1", ""))});
        }
        setIsRecording(!isRecording);
    };

    const openSaveReactionModal = () => {
        setShowSaveModal(true);
    }
    const closeSaveReactionModal = () => {
        setShowSaveModal(false);
    }

    const saveReaction = () => {
        if(isRecording){
            setIsRecording(!isRecording);
        }
        openSaveReactionModal();
        /*
        // eslint-disable-next-line no-unused-vars
        saveNewReaction(stimuliId).then(result => {
              window.location.reload();
          })

         */

    };

    const canvasRef = useRef(null);
    const [analysisData, setAnalysisData] = useState({
        0: 0.0,
        1: 0.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
        6: 0.0,
        "time": 0
    });

    return !user ? (<></>) : (
        <>
            <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
                <Grid item xs={12}>
                    <StimuliHeader stimulus={stimuliData} projectData={projectData} experimentData={experimentData}/>
                </Grid>
            </Grid>
            <SaveReactionModal showModal={showSaveModal} closeModal={closeSaveReactionModal} stimuliId={id}/>
            <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>

                <Grid item lg={6} md={12} sm={12} xs={12}>
                    <Box>
                        <iframe width={'100%'}
                                height={'300px'}
                                src={stimuliData.link}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                        </iframe>
                    </Box>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                    <AnalysisDataContext.Provider value={{analysisData, setAnalysisData}}>
                        <WebcamComponent canvasRef={canvasRef} isLoading={isLoading}/>
                        <VisageProcessing canvasRef={canvasRef} isLoading={isLoading}
                                          isRecording={isRecording}/>

                        <AnalysisResultsComponent analysisData={analysisData} isLoading={isLoading}/>

                        <Box sx={{display: 'flex', gap: '1rem', padding: '1rem', justifyContent: 'center'}}>
                            <Button
                                id={"button-toggle-recording"}
                                variant={isRecording ? '' : 'contained'}
                                sx={isRecording ? {
                                    color: theme.palette.grey[700],
                                    backgroundColor: theme.palette.grey[50],
                                } : {
                                    color: theme.palette.secondary
                                }}
                                onClick={toggleRecording}
                                disableElevation>
                                    {isRecording ? (<>
                                        <VideocamOff/>
                                        Stop Recording
                                    </>) : (<>
                                        <Videocam/>
                                        Start Recording
                                    </>)
                                    }
                            </Button>

                            <Button
                                id={"button-save-reaction"}
                                variant="contained"
                                onClick={saveReaction}
                                disableElevation
                                disabled={saveDisabled}
                            >
                                Save
                            </Button>
                        </Box>
                        <Box>
                            <Typography sx={{color: theme.palette.grey[500], textDecoration: 'none'}}>
                                Note: if you press <i>Start Recording</i> again after already recording a reaction,
                                the previous reaction will be automatically discarded.
                            </Typography>
                        </Box>
                    </AnalysisDataContext.Provider>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <ReactionsContent stimuliId={id}/>
                </Grid>

            </Grid>
        </>
    );
};

export default Stimuli;
