import React, {useEffect, useState} from 'react';
import WebcamSetup from './WebcamSetup';
import WebcamCanvas from './WebcamCanvas';

const WebcamComponent = () => {
    const [videoStream, setVideoStream] = useState(null);

    const handleStreamReady = (webcamRef) => {
        setVideoStream(webcamRef.current);
    };

    return (
        
        <div id="inner-container">
            <WebcamSetup onStreamReady={handleStreamReady}/>
            <WebcamCanvas videoStream={videoStream}/>
        </div>
        
    );
};

export default WebcamComponent;