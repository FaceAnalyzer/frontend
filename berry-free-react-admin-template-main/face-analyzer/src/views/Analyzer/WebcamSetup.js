/* eslint-disable jsx-a11y/media-has-caption */
import React, { /*useCallback,*/ useEffect, useRef } from 'react';

const WebcamSetup = ({onStreamReady}) => {
    const webcamRef = useRef(null);

    /*
    const handleStreamReady = useCallback((stream) => {
        console.log("Stream ready:", stream);
        onStreamReady(webcamRef.current);
        webcamRef.current.srcObject = stream;
    }, [onStreamReady]);
    */

    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: true})
        .then((stream) => {
            webcamRef.current.srcObject = stream;
            onStreamReady(stream);
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
        });

        onStreamReady(webcamRef);

        return() => {
            if(webcamRef && webcamRef.current.srcObject){
                const tracks = webcamRef.current.srcObject.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            
        };
    }, [onStreamReady]);

    return <video className="video" ref={webcamRef} width="640px" height="480px" autoPlay playsInline></video>
};

export default WebcamSetup;