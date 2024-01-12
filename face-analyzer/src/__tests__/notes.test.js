import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import axios from 'axios';

import {useAuth} from "../context/authContext";
import Notes from "../views/experiments/notes/Notes";

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn(() => {
    experimentId: "1000"
});

jest.mock('../context/authContext');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => mockedUseParams,
}));

describe('Notes Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from /notes to /login for anonymous user', async () => {
            const {container, getByText} = render(
                <MemoryRouter>
                    <Notes/>
                </MemoryRouter>
            );

            await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/login'));
        });
    });

    describe('User is authenticated as Admin', () => {
        let projectResp;
        let experimentResp;
        let notesResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {id: 222, role: 'Admin'}});
            notesResp = {
                data: {
                    items: [
                        {id: 1, description: "test not 1", experimentId: 1000, creatorId: 222},
                        {id: 2, description: "test not 2", experimentId: 1000, creatorId: 333}
                    ]
                }
            };
            experimentResp = {data: {id: 1000, name: 'test ex 1', description: "test desc 1", projectId: 100}};
            projectResp = {data: {id: 100, name: "test project"}};
        });

        test("Notes should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(notesResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Notes/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/test not 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test not 2/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test project/i)).toBeInTheDocument())
        });

        test("Add card should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(notesResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Notes/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new note/i)).toBeInTheDocument())
        });

    });

    describe('User is authenticated as Researcher', () => {
        let projectResp;
        let experimentResp;
        let notesResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {id: 222, role: 'Researcher'}});
            notesResp = {
                data: {
                    items: [
                        {id: 1, description: "test not 1", experimentId: 1000, creatorId: 222},
                        {id: 2, description: "test not 2", experimentId: 1000, creatorId: 333}
                    ]
                }
            };
            experimentResp = {data: {id: 1000, name: 'test ex 1', description: "test desc 1", projectId: 100}};
            projectResp = {data: {id: 100, name: "test project"}};
        });

        test("Notes should be rendered for Researcher", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(notesResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Notes/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/test not 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test not 2/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test project/i)).toBeInTheDocument())
        });

        test("Add card should be rendered for Researcher", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(notesResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Notes/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new note/i)).toBeInTheDocument())
        });
    })
});