import React, {useEffect, useState} from "react";
import YouTube from "react-youtube";
import {analysisInterval} from "../../reactions/VisageProcessing";
import NewChart from "./NewChart";
import {Grid} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import PropTypes from "prop-types";

const DynamicChart = ({ isLoading, stimuliData, groupedSortedData }) => {
    const [videoTimeMs, setVideoTimeMs] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [youtubePlayer, setYoutubePlayer] = useState(null);

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

    const handlerOnReady = (event) => {
        setYoutubePlayer(event.target);
    }

    useEffect(() => {
        if(groupedSortedData instanceof Array){
            // eslint-disable-next-line
            groupedSortedData = {};
        }
    }, [groupedSortedData]);

    useEffect(() => {
        if(youtubePlayer){
            // youtubePlayer.seekTo(timestamp/1000);
        }
    }, [timestamp, youtubePlayer]);

    return(
        <Grid container spacing={2} direction={"row"} alignItems={"center"}>
            <Grid item xs={12} md={3}>
                <YouTube
                    style={{ display: 'flex', justifyContent: 'center' }}
                    videoId={stimuliData.videoId}
                    id={'youtube-player'}
                    title={'Youtube embedding'}
                    onPlay={handlerOnPlay}
                    onPause={handlerOnPause}
                    onEnd={handlerOnPause}
                    onReady={handlerOnReady}
                />
            </Grid>
            <Grid item xs={12} md={9}>
                {isLoading ? (
                    <Skeleton animation={"wave"}>
                        <NewChart groupedSortedData={groupedSortedData} videoTimeMs={videoTimeMs}/>
                    </Skeleton>
                ):(
                    <NewChart groupedSortedData={groupedSortedData} videoTimeMs={videoTimeMs} setTimestamp={setTimestamp}/>
                )}
            </Grid>
        </Grid>
    )
}

DynamicChart.propTypes = {
    isLoading: PropTypes.bool,
    stimuliData: PropTypes.object,
    groupedSortedData: PropTypes.object,
};

export default DynamicChart;