import WebcamComponent from './WebcamComponent';
import VisageProcessing from './VisageProcessing';
import AnalysisResultsComponent from "./AnalysisResultsComponent";
import React, {useEffect, useRef, useState} from "react";
import {AnalysisDataContext} from "./AnalysisDataContext";
import {saveNewReaction} from "./AnalysisDataFunctions";
import {Button, Grid} from "@mui/material";
import {Navigate, useParams} from "react-router";
import {useAuth} from "../../context/authContext";

// ==============================|| Analyzer ||============================== //

const Reaction = () => {
    const {stimuliId} = useParams();
    const [isLoading, setLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const user = useAuth();

    useEffect(() => {
        setLoading(false);
    }, []);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    const saveReaction = () => {
        saveNewReaction(stimuliId).then();
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

    return !user ? (<Navigate to="/login" replace/>) : (
        <AnalysisDataContext.Provider value={{analysisData, setAnalysisData}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <div id="inner-container">
                        <WebcamComponent canvasRef={canvasRef} isLoading={isLoading}/>
                        <VisageProcessing canvasRef={canvasRef} isLoading={isLoading} isRecording={isRecording}/>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <AnalysisResultsComponent analysisData={analysisData} isLoading={isLoading}/>
                    <Grid container>
                        <Grid item xs={6}>
                        <Button variant="contained" onClick={toggleRecording}>
                            {isRecording ? (
                                "Stop Recording"
                                ) : (
                                "Start Recording")
                            }
                        </Button>
                        </Grid>
                        <Grid item xs={4}>
                        <Button variant="contained" onClick={saveReaction}>Save</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AnalysisDataContext.Provider>
    );
};

export default Reaction;
