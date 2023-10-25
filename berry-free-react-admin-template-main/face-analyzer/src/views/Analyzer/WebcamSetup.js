/* eslint-disable jsx-a11y/media-has-caption */
import React, { /*useCallback,*/ useEffect, useRef } from 'react';

const WebcamSetup = ({onStreamReady}) => {
    const webcamRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices
        .getUserMedia({ video: true})
        .then((stream) => {
            webcamRef.current.srcObject = stream;
            onStreamReady(webcamRef);
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
        });

        
        return() => {
            console.log("remove")
            if(webcamRef && webcamRef.current.srcObject){
                const tracks = webcamRef.current.srcObject.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            
        };
    }, []);

    return <video className="video" ref={webcamRef} width="640px" height="480px" autoPlay playsInline hidden></video>
};

export default WebcamSetup;