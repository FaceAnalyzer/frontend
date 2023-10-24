import React, {useEffect, useState} from 'react';
import WebcamSetup from './WebcamSetup';
import WebcamCanvas from './WebcamCanvas';

const WebcamComponent = () => {
    const [videoStream, setVideoStream] = useState(null);

    const handleStreamReady = (webcamRef) => {
        console.log("hsr", webcamRef)
        setVideoStream(webcamRef.current);
        console.log("vs", videoStream)
    };

    useEffect(() => {
        console.log("VSU:", videoStream);
    }, [videoStream]);

    return (
        
        <div id="inner-container">
            <WebcamSetup onStreamReady={handleStreamReady}/>
            <WebcamCanvas videoStream={videoStream}/>
        </div>
        
    );
};

export default WebcamComponent;