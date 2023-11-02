import React, {useEffect, useRef} from 'react';

// ===========================|| Canvas ||=========================== //
const WebcamCanvas = ({videoStream, canvasRef}) => {
    const bgCanvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        //const bgCanvas = bgCanvasRef.current;

        const ctx = canvas.getContext('2d');
        ctx.willReadFrequently = true;
        //const bgCtx = bgCanvas.getContext('2d');

        const drawFrame = () => {
            ctx.drawImage(videoStream, 0, 0, 640, 480);
            requestAnimationFrame(drawFrame); // Request next frame
        };
        
        if(videoStream) {
            console.log(videoStream);
            setInterval(function() {
                drawFrame()
            }, 100);
        }
        

        return() => {
        };
    }, [videoStream]);
    

    return(<>
            <canvas id='webcamCanvas' ref={canvasRef} width={640} height={480}></canvas>
            <canvas id='bgCanvas' ref={bgCanvasRef} width={640} height={480} style={{display:'none'}}></canvas>
            </>
    );
};

export default WebcamCanvas;