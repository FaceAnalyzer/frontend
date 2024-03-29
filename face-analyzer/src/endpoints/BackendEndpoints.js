//Project
export const ADD_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/projects';
export const EDIT_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/projects/{id}';
export const DELETE_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/projects/{id}';
export const GET_PROJECTS_API = process.env.REACT_APP_BACKEND_API_URL + '/projects';
export const GET_PROJECT_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/projects/{id}';

//Experiment
export const ADD_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const DELETE_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const EDIT_EXPERIMENT_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const GET_EXPERIMENTS_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments';
export const GET_EXPERIMENT_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments/{id}';
export const GET_EXPERIMENTS_BY_PROJECT_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/experiments?projectId={id}';
export const GET_EXPORT_EXPERIMENT = process.env.REACT_APP_BACKEND_API_URL + '/experiments/{id}/export';

//Notes
export const ADD_NOTE_API = process.env.REACT_APP_BACKEND_API_URL + '/notes';
export const DELETE_NOTE_API = process.env.REACT_APP_BACKEND_API_URL + '/notes/{id}';
export const EDIT_NOTE_API = process.env.REACT_APP_BACKEND_API_URL + '/notes/{id}';
export const GET_NOTES_BY_EXPERIMENT_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/notes?experimentId={id}';
export const GET_NOTE_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/notes/{id}';


//Stimuli
export const GET_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const GET_STIMULI_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli/{id}';
export const ADD_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const EDIT_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const DELETE_STIMULI_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli';
export const DELETE_STIMULI_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/stimuli/{id}';

//Reactions
export const GET_REACTIONS_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions';
export const ADD_REACTION_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions';
export const GET_REACTIONS_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}';
export const DELETE_REACTIONS_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}';
export const GET_EXPORT_REACTION = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}/emotions/export';

//Emotions
export const GET_EMOTIONS_API = process.env.REACT_APP_BACKEND_API_URL + '/reactions/{id}/emotions';
export const ADD_EMOTION_API = process.env.REACT_APP_BACKEND_API_URL + '/emotions';


//Users
export const ADD_USERS_API = process.env.REACT_APP_BACKEND_API_URL + '/users';
export const GET_USERS_API = process.env.REACT_APP_BACKEND_API_URL + '/users';
export const GET_USER_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users/{id}';
export const PUT_USER_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users/{id}';
export const DELETE_USER_BY_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users/{id}';
export const GET_USERS_BY_PROJECT_ID_API = process.env.REACT_APP_BACKEND_API_URL + '/users?ProjectId={id}&Role=Researcher';
export const GET_RESEARCHERS_API = process.env.REACT_APP_BACKEND_API_URL + '/users?Role=Researcher';
export const ADD_RESEARCHER_TO_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/projects/{id}/researcher/add';
export const REMOVE_RESEARCHER_FROM_PROJECT_API = process.env.REACT_APP_BACKEND_API_URL + '/projects/{id}/researcher/remove';

//Auth
export const LOGIN_API = process.env.REACT_APP_BACKEND_API_URL + '/auth/login';
export const PASSWORD_RESET_API = process.env.REACT_APP_BACKEND_API_URL + '/auth/reset-user-password';

//Ping
export const PING_API = process.env.REACT_APP_BACKEND_API_URL + '/ping';

//Miscellaneous
export const DEFAULT_API_CONFIG = {
    headers: {
        "accept": "text/plain",
        "Content-Type": "application/json"
    }
}
