import React, {useState} from "react";
import YouTube from "react-youtube";
import { analysisInterval } from "../../reactions/VisageProcessing";
import NewChart from "./NewChart";
import {Grid} from "@mui/material";

const DynamicChart = ({ stimuliData, groupedSortedData }) => {
    const [videoTimeMs, setVideoTimeMs] = useState(0);

    let interval = null;

    const timeUpdate = (event) => {
        setVideoTimeMs(event.target.getCurrentTime() * 1000);
    }

    const handlerOnPlay = (event) => {
        interval = setInterval(() => timeUpdate(event), analysisInterval);
    }

    const handlerOnPause = () => {
        clearInterval(interval);
        interval = null;
    }

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <YouTube
                    style={{ display: 'flex', justifyContent: 'center' }}
                    videoId={stimuliData.videoId}
                    id={'youtube-player'}
                    title={'Youtube embedding'}
                    onPlay={handlerOnPlay}
                    onPause={handlerOnPause}
                    onEnd={handlerOnPause}
                />
            </Grid>
            <Grid item xs={12}>
                <NewChart groupedSortedData={groupedSortedData} videoTimeMs={videoTimeMs}/>
            </Grid>
        </Grid>
    )
}

export default DynamicChart;