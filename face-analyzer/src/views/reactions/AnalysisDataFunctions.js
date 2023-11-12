import axios from "axios";
import {ADD_EMOTION_API, ADD_REACTION_API} from "./BackendEndpoints";
import {DEFAULT_API_CONFIG} from "../projects/BackendEndpoints";

let firstRun = true;
const dataKey = "analysisData"

const emotion_types = ["Anger", "Disgust", "Fear", "Happiness", "Sadness", "Surprise", "Neutral"];

const handleSaveEmotion = (values, /*{setErrors, setStatus}*/) => {
    try{
        axios.post(ADD_EMOTION_API, JSON.stringify(values), DEFAULT_API_CONFIG)
            .then(response => {
                if (response.status === 201) {
                    console.log("Success");
                }
                else{
                    console.error(response.data.errors);
                }
            });
    } catch (e) {
        console.error(e);
    }
};

const handleSaveReaction = async (values) => {
        return await axios.post(ADD_REACTION_API, JSON.stringify(values), DEFAULT_API_CONFIG)
            .then(response => {
                if (response.status === 201 || response.status === 200) {
                    return response.data.id;
                }
                else{
                    console.error(response.data.errors);
                }
            }).catch((e) => {
        console.error(e);
    });
}

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

export const saveNewReaction = async (stimuliId) => {
    let retrieved = localStorage.getItem(dataKey);
    let stored = JSON.parse(retrieved);

    //Create new reaction
    const tempReactionData = {
        "stimuliId": stimuliId,
        "participantName": "Stephan Horvat III"
    };
    await handleSaveReaction(tempReactionData).then((reactionId) => {
        if (reactionId !== undefined) {
            stored.forEach((emotionsData) => {
                const time = emotionsData["time"];
                for (let i = 0; i < 7; i++) {
                    const tempEmotionData = {
                        "value": emotionsData[i],
                        "timeOffset": time,
                        "emotionType": emotion_types[i],
                        "reactionId": reactionId
                    };
                    handleSaveEmotion(tempEmotionData);
                }
            });
        } else {
            console.error("Error creating reaction.");
        }
    });
};
