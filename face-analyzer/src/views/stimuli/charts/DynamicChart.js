import React, {useState} from "react";
import YouTube from "react-youtube";
import { analysisInterval } from "../../reactions/VisageProcessing";
import NewChart from "./NewChart";

const DynamicChart = ({ stimuliData, groupedSortedData }) => {
    const [videoPercentage, setVideoPercentage] = useState(0);

    let interval = null;

    const timeUpdate = (event) => {
        setVideoPercentage( event.target.getCurrentTime() / event.target.getDuration());
    }

    const handlerOnPlay = (event) => {
        interval = setInterval(() => timeUpdate(event), analysisInterval);
    }

    const handlerOnPause = () => {
        clearInterval(interval);
        interval = null;
    }

    return(
        <>
            <div>
                {videoPercentage.toFixed(2)} - {(100*videoPercentage).toFixed(2)}%
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
                <NewChart groupedSortedData={groupedSortedData} videoPercentage={videoPercentage}/>
            </div>
        </>
    )
}

export default DynamicChart;