import {useCallback, useContext, useEffect} from "react";
import {AnalysisDataContext} from "./AnalysisDataContext";
import {saveDataToLocalStorage} from "./AnalysisDataFunctions";

//Analysis interval in ms
export const analysisInterval = 100;

/*
Used to handle processing of the data gathered from the webcam canvas. After initializing the license manager, sets
up the tracker and analyser, and then processes the data on a set interval.
 */
const VisageProcessing = ({canvasRef, isLoading, isRecording}) => {
    const {analysisData, setAnalysisData} = useContext(AnalysisDataContext);

    const updateAnalysisData = useCallback((newData) => {
        setAnalysisData(newData);
    }, [setAnalysisData]);

    useEffect(() => {
        saveDataToLocalStorage(analysisData)
    }, [analysisData]);

    useEffect(() => {
        if(isLoading){
            return;
        }

        if(isRecording){
        //Initializing the license manager - IMPORTANT
        VisageModule.initializeLicenseManager("./728-647-708-712-368-939-525-416-088-305-748.vlc");

        var m_Tracker,
            m_FaceAnalyser,
            tmpAnalysisData,
            faceData,
            faceDataArray,
            frameWidth,
            frameHeight,
            canvas;

        canvas = canvasRef.current;
        console.log("Processing");

        //Setting up necessary variables for tracking and analysis
        m_Tracker = new VisageModule.VisageTracker("Head Tracker.cfg");
        faceDataArray = new VisageModule.FaceDataVector();
        faceData = new VisageModule.FaceData();
        faceDataArray.push_back(faceData);

        m_FaceAnalyser = new VisageModule.VisageFaceAnalyser();

        frameWidth = canvas.width;
        frameHeight = canvas.height;

        //Allocating memory for storing the pixel data
        var ppixels = VisageModule._malloc(frameWidth*frameHeight*4);
        var pixels = new Uint8ClampedArray(VisageModule.HEAPU8.buffer, ppixels, frameWidth*frameHeight*4);

        let startTime = Date.now();

        //Perform analysis at a fixed interval
        const recording = () => {
            var trackerStatus = [];
            tmpAnalysisData = new VisageModule.AnalysisData();

            //Get image data and put it in the previously allocated memory
            var imageData = canvas.getContext('2d').getImageData(0, 0, frameWidth, frameHeight).data;
            pixels.set(imageData);

            //Perform tracking
            trackerStatus = m_Tracker.track(
                frameWidth, frameHeight, ppixels, faceDataArray,
                VisageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
                VisageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value
            );

            //console.log("conf:", m_Tracker.getConfiguration());

            /*
            If the tracking is successful (i.e. if it finds a face), use its result for analysis.
            Else, handle the possible failure - I think it can be left empty, or maybe inform the user a face cannot be
            found (might be useful in low-light situations?).
             */
            if(trackerStatus[0] === VisageModule.VisageTrackerStatus.TRACK_STAT_OK.value){
                m_FaceAnalyser.analyseStream(frameWidth, frameHeight, ppixels, faceDataArray.get(0),
                    VisageModule.VFAFlags.VFA_EMOTION.value,
                    tmpAnalysisData, 0);

                //setAnalysisData(tmpAnalysisData);
                let probabilities = tmpAnalysisData.getEmotionProbabilities();
                probabilities["time"] = Date.now() - startTime;
                updateAnalysisData(probabilities);
            }
            else{
                //We can end up here if no faces are detected at any point, or if the tracker is not properly initialized
                //console.error("Tracker error!", trackerStatus);
            }
        }
        const interval = setInterval(recording, analysisInterval);

        //Release the memory allocated for the various operations.
        return(() => clearInterval(interval));
        }
    }, [canvasRef, isLoading, isRecording, updateAnalysisData]);
}

export default VisageProcessing;
