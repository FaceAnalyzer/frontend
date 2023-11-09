import WebcamComponent from './WebcamComponent';
import VisageProcessing from './VisageProcessing';
import AnalysisResultsComponent from "./AnalysisResultsComponent";
import {useEffect, useRef, useState} from "react";
import {AnalysisDataContext} from "./AnalysisDataContext";
import {Grid} from "@mui/material";

// ==============================|| Analyzer ||============================== //

const Analyzer = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const canvasRef = useRef(null);
    var [analysisData, setAnalysisData] = useState(new VisageModule.AnalysisData());

    return (
        <AnalysisDataContext.Provider value={{analysisData, setAnalysisData}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <div id="inner-container">
                        <WebcamComponent canvasRef={canvasRef} isLoading={isLoading}/>
                        <VisageProcessing canvasRef={canvasRef} isLoading={isLoading}/>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <AnalysisResultsComponent analysisData={analysisData} isLoading={isLoading}/>
                </Grid>
            </Grid>
        </AnalysisDataContext.Provider>
    );
};

export default Analyzer;
