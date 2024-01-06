// __mocks__/authContext.js
const authContext = jest.requireActual('../context/authContext');

export const useAuth = jest.fn(() => ({
    user: null,
    token: null,
}));

export default authContext;
