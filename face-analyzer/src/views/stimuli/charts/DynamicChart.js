import React, {useEffect, useState} from "react";
import YouTube from "react-youtube";
import { analysisInterval } from "../../reactions/VisageProcessing";
import NewChart from "./NewChart";
import {Grid} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const DynamicChart = ({ isLoading, stimuliData, groupedSortedData }) => {
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

    useEffect(() => {
        if(groupedSortedData instanceof Array){
            groupedSortedData = {};
        }
    }, [groupedSortedData]);

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
                {isLoading ? (
                    <Skeleton animation={"wave"}>
                        <NewChart groupedSortedData={groupedSortedData} videoTimeMs={videoTimeMs}/>
                    </Skeleton>
                ):(
                    <NewChart groupedSortedData={groupedSortedData} videoTimeMs={videoTimeMs}/>
                )}
            </Grid>
        </Grid>
    )
}

export default DynamicChart;