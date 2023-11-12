import React, {useEffect, useRef, useState} from 'react';

// material-ui
import {Box, Button, Card, Grid} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import {useParams} from "react-router";
import axios from "axios";
import {GET_STIMULI_API} from "../projects/BackendEndpoints";
import StimuliHeader from "./StimuliHeader";
import WebcamComponent from "../reactions/WebcamComponent";
import VisageProcessing from "../reactions/VisageProcessing";
import AnalysisResultsComponent from "../reactions/AnalysisResultsComponent";
import {AnalysisDataContext} from "../reactions/AnalysisDataContext";
import {saveNewReaction} from "../reactions/AnalysisDataFunctions";

// ==============================|| STIMULUS DASHBOARD ||============================== //

const Stimuli = () => {
    const {stimuliId} = useParams();
    const [stimuliData, setStimuliData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ID = parseInt(stimuliId);
                console.log("ID", ID);

                const stimuliResponse = await axios.get(GET_STIMULI_API + '/' + stimuliId);
                console.log("response",stimuliResponse);
                const items = stimuliResponse.data;
                //TODO: how to do this in a more consistent way?
                items.link = items.link.replace("watch?v=", "embed/")
                console.log("items", items);
                setStimuliData(items);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching stimuli data:', error);
                setLoading(false); // Set loading to false even in case of an error
            }
        };

        fetchData();
    }, [stimuliId]);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    const saveReaction = () => {
        saveNewReaction(stimuliId);
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


    return (
        <>
            <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
                <Grid item xs={12}>
                    <StimuliHeader stimulus={stimuliData}/>
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
                <Grid item>
                    <Box>
                        <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Box>
                                    <iframe width="560" height="315"
                                            src={stimuliData.link}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen>
                                    </iframe>
                                </Box>
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, pr: 2}}>
                                    <AnalysisDataContext.Provider value={{analysisData, setAnalysisData}}>
                                        <Box>
                                            <WebcamComponent canvasRef={canvasRef} isLoading={isLoading}/>
                                            <VisageProcessing canvasRef={canvasRef} isLoading={isLoading} isRecording={isRecording}/>
                                            <AnalysisResultsComponent analysisData={analysisData} isLoading={isLoading}/>
                                        </Box>

                                        <Box>
                                            <Button variant="contained" onClick={toggleRecording}>
                                                {isRecording ? (
                                                    "Stop Recording"
                                                ) : (
                                                    "Start Recording")
                                                }
                                            </Button>

                                            <Button variant="contained" onClick={saveReaction}>
                                                Save
                                            </Button>
                                        </Box>
                                    </AnalysisDataContext.Provider>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            {/*{reactionList && reactionList.map((stimulus) => (*/}
            {/*    <Grid item key={reaction.id} lg={4} md={6} sm={6} xs={12}>*/}
            {/*        <StimuliCard isLoading={isLoading} data={reaction}/>*/}
            {/*    </Grid>*/}
            {/*))}*/}
        </>
    );
};

export default Stimuli;
