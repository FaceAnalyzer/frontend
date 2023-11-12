import React, {useState} from 'react';
import WebcamSetup from './WebcamSetup';
import WebcamCanvas from './WebcamCanvas';
import PropTypes from "prop-types";

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

WebcamComponent.propTypes = {
    canvasRef: PropTypes.object,
    isLoading: PropTypes.bool
};

export default WebcamComponent;