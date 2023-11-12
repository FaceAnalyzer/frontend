import React, {useEffect} from 'react';
import PropTypes from "prop-types";
import WebcamSetup from "./WebcamSetup";

// ===========================|| Canvas ||=========================== //
const WebcamCanvas = ({videoStream, canvasRef}) => {

    useEffect(() => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');
        ctx.willReadFrequently = true;

        let lastRenderTime = 0;
        const fps = 30;

        const drawFrame = (currentTime) => {
            if(!lastRenderTime || currentTime - lastRenderTime >= 1000 / fps){
                ctx.drawImage(videoStream, 0, 0, 640, 480);
                lastRenderTime = currentTime;
            }

            requestAnimationFrame(drawFrame); // Request next frame
        };

        let animationFrameId = null;
        
        if(videoStream) {
            animationFrameId = requestAnimationFrame(drawFrame);
        }

        return() => cancelAnimationFrame(animationFrameId);
    }, [videoStream, canvasRef]);
    

    return(
        <>
            <canvas id='webcamCanvas' ref={canvasRef} width={640} height={480} hidden></canvas>
        </>
    );
};

WebcamCanvas.propTypes = {
    videoStream: PropTypes.object,
    canvasRef: PropTypes.object
}

export default WebcamCanvas;