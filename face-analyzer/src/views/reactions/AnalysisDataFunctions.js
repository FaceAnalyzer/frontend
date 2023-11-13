import axios from "axios";
import {ADD_REACTION_API} from "./BackendEndpoints";
import {DEFAULT_API_CONFIG} from "../projects/BackendEndpoints";

let firstRun = true;
const dataKey = "analysisData"

const emotion_types = ["Anger", "Disgust", "Fear", "Happiness", "Sadness", "Surprise", "Neutral"];

const handleSaveReaction = async (values) => {
    try{
        await axios.post(ADD_REACTION_API, JSON.stringify(values), DEFAULT_API_CONFIG)
            .then(response => {
                if (response.status === 201 || response.status === 200) {
                    return response.data.id;
                }
                else{
                    console.error(response.data.errors);
                }
                console.log("Response", response);
            });
    }
    catch(e){
        console.error(e);
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

export const saveNewReaction = async (stimuliId) => {
    let retrieved = localStorage.getItem(dataKey);
    let stored = JSON.parse(retrieved);

    const tempReadings = [];

    stored.forEach((emotionsData) => {
        const time = emotionsData["time"];
        if(!time)
            return;

        const values = {}
        for (let key in emotion_types) {
            values[emotion_types[key]] = emotionsData[key];
        }

        const reading = {
            time, values
        };

        tempReadings.push(reading);
    });

    //TODO: add actual participant name
    const forStoring = {
        stimuliId: stimuliId,
        participantName: "Participant Name",
        emotionReadings: tempReadings
    }
    await handleSaveReaction(forStoring);
};