export const ADD_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const DELETE_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const EDIT_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const GET_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const ADD_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/project';
export const GET_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const ADD_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const EDIT_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const DELETE_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const GET_REACTIONS_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions';
export const GET_EMOTIONS_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}/emotions';
export const DEFAULT_API_CONFIG = {
    headers: {
        "accept": "text/plain",
        "Content-Type": "application/json"
    }
}
