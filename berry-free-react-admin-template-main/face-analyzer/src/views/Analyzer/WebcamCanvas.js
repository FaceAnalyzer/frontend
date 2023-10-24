import React, { useEffect, useRef, useState } from 'react';

// ===========================|| Canvas ||=========================== //
const WebcamCanvas = ({videoStream}) => {
    const canvasRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const [isStreamReady, setIsStreamReady] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const bgCanvas = bgCanvasRef.current;

        const ctx = canvas.getContext('2d');
        const bgCtx = bgCanvas.getContext('2d');

        console.log(videoStream);

        const handleCanPlay = () => {
            console.log("Stream can play!");
            setIsStreamReady(true);
            videoStream.removeEventListener('canplay', handleCanPlay);
        };

        /*
        if(videoStream) {
            videoStream.addEventListener('canplay', handleCanPlay);
            videoStream.play();
        }
        */

        return() => {
            if(videoStream){
                videoStream.removeEventListener('canplay', handleCanPlay);
            }
        };
    }, [videoStream]);

    useEffect(() => {
        if(isStreamReady) {
            // Draw webcam image to canvas periodically
            const drawFrame = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoStream, 0, 0, 640, 480);
                requestAnimationFrame(drawFrame); // Request next frame
            };

            //Start drawing frames
            drawFrame();
            console.log("Stream ready.")
        }
        else{
            console.error("Stream not ready.")
        }
    }, [isStreamReady, videoStream]);

    useEffect(() => {
        if(videoStream){
            setIsStreamReady(true);
        }
    }, [videoStream]);

    return(<>
            <canvas id='webcamCanvas' ref={canvasRef} width={640} height={480}></canvas>
            <canvas id='bgCanvas' ref={bgCanvasRef} width={640} height={480} style={{display:'none'}}></canvas>
            </>
    );
};

export default WebcamCanvas;