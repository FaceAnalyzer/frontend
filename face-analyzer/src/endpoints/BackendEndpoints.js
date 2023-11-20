//Experiment
export const ADD_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const DELETE_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const EDIT_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const GET_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';

//Stimuli
export const GET_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const GET_STIMULI_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli/{id}';
export const ADD_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const EDIT_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const DELETE_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const DELETE_STIMULI_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli/{id}';

//Project
export const ADD_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/project';

//Reactions
export const GET_REACTIONS_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions';
export const GET_REACTIONS_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}';
export const DELETE_REACTIONS_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}';

//Emotions
export const GET_EMOTIONS_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}/emotions';
export const ADD_EMOTION_API = process.env.REACT_APP_BACKEND_API_URL + '/emotions';
export const ADD_REACTION_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions';

//Users
export const ADD_USERS_API = process.env.REACT_APP_BACKEND_API_URL + '/users';
export const GET_USERS_API = process.env.REACT_APP_BACKEND_API_URL + '/users';
export const GET_USER_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users/{id}';
export const PUT_USER_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users/{id}';
export const DELETE_USER_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users/{id}';

//Miscellaneous
export const DEFAULT_API_CONFIG = {
    headers: {
        "accept": "text/plain",
        "Content-Type": "application/json"
    }
}
