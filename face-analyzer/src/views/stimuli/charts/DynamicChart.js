import React, {useEffect, useRef, useState} from "react";
import Chart from "react-apexcharts";
import YouTube from "react-youtube";
import { analysisInterval } from "../../reactions/VisageProcessing";
import EmotionsOverTimeChart from "./EmotionsOverTimeChart";

const DynamicChart = ({ stimuliData, groupedSortedData }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const [videoTime, setVideoTime] = useState(null);

    let interval = null;

    const timeUpdate = (event) => {
        setVideoTime(event.target.getCurrentTime() / event.target.getDuration());
    }

    const handlerOnPlay = (event) => {
        interval = setInterval(() => timeUpdate(event), analysisInterval);

    }

    const handlerOnPause = (event) => {
        clearInterval(interval);
        interval = null;
    }

    return(
        <>
            <div>
                {(videoTime * 100).toFixed(2)}%
            </div>
            <div>
                <YouTube
                    videoId={stimuliData.videoId}
                    id={'youtube-player'}
                    title={'Youtube embedding'}
                    onPlay={handlerOnPlay}
                    onPause={handlerOnPause}
                    onEnd={handlerOnPause}
                />
            </div>
            <div>
                <EmotionsOverTimeChart groupedSortedData={groupedSortedData} annotations={videoTime}/>
            </div>
        </>
    )
}

export default DynamicChart;