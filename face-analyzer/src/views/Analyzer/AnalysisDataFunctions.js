import axios from "axios";
import {ADD_EMOTION_API} from "./BackendEndpoints";

let firstRun = true;
const dataKey = "analysisData"
const reactionId = 1;

const emotion_types = ["Anger", "Disgust", "Fear", "Happiness", "Sadness", "Surprise", "Neutral"];

const handleSave = (values, /*{setErrors, setStatus}*/) => {
    try{
        axios.post(ADD_EMOTION_API, JSON.stringify(values),
            {headers: {"accept": "text/plain", "Content-Type": "application/json"}})
            .then(response => {
                if (response.status === 201) {
                    console.log("Success");
                }
                else{
                    const data = response.data;
                    //setErrors(data.errors);
                    //setStatus({success: false});
                }
            });
    } catch (e) {
        console.error(e);
        //setErrors({submit: err.message});
        //setStatus({success: false});
    }
};

export const saveDataToLocalStorage = (data) => {
    let retrieved = localStorage.getItem(dataKey);
    let stored;
    if(retrieved && !firstRun){
        stored = JSON.parse(retrieved);
    }
    else{
        localStorage.removeItem(dataKey);
        firstRun = false;
        stored = [];
    }

    stored.push(data);
    localStorage.setItem(dataKey, JSON.stringify(stored));
};

export const saveNewReaction = () => {
    let retrieved = localStorage.getItem(dataKey);
    let stored = JSON.parse(retrieved);
    console.log(stored);
    stored.forEach((emotionsData) => {
        const time = emotionsData["time"];
        for(let i = 0; i < 7; i++){
            const tempEmotionData = {
                "value": emotionsData[i],
                "timeOffset": time,
                "emotionType": emotion_types[i],
                "reactionId": reactionId
            };
            console.log("ted:", tempEmotionData);
            handleSave(tempEmotionData);
        }
    });
};
