/* eslint-disable jsx-a11y/media-has-caption */
import React, { /*useCallback,*/ useEffect, useRef } from 'react';
import PropTypes from "prop-types";

const WebcamSetup = ({onStreamReady}) => {
    const webcamRef = useRef(null);

    useEffect(() => {
        const webcam = webcamRef.current
        navigator.mediaDevices
        .getUserMedia({ video: true})
        .then((stream) => {
            webcam.srcObject = stream;
            onStreamReady(webcamRef);
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
        });

        
        return() => {
            /*
            console.log("remove webcam")
            try {
                if (webcamRef && webcam.srcObject) {
                    const tracks = webcam.srcObject.getTracks();
                    tracks.forEach((track) => {
                        track.stop();
                    });
                }
            } catch (e) {
                if (e instanceof TypeError){
                    //ignore
                }
                else throw e;
            }
            */
        };
    }, [onStreamReady]);

    return <video className="video" ref={webcamRef} width="640px" height="480px" autoPlay playsInline hidden></video>
};

WebcamSetup.propTypes = {
    onStreamReady: PropTypes.func
};

export default WebcamSetup;