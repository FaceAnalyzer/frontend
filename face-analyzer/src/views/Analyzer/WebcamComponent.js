import React, {useState} from 'react';
import WebcamSetup from './WebcamSetup';
import WebcamCanvas from './WebcamCanvas';

const WebcamComponent = ({canvasRef, isLoading}) => {
    const [videoStream, setVideoStream] = useState(null);

    const handleStreamReady = (webcamRef) => {
        setVideoStream(webcamRef.current);
    };

    return (
        <>
        {isLoading ? (
            <></>
        ) : (
            <div id="inner-container">
                <WebcamSetup onStreamReady={handleStreamReady}/>
                <WebcamCanvas videoStream={videoStream} canvasRef={canvasRef}/>
            </div>
        )}
        </>
        
    );
};

export default WebcamComponent;