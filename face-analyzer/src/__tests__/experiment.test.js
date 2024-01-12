import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import axios from 'axios';

import {useAuth} from "../context/authContext";
import Experiment from "../views/experiments/Experiment";

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

describe('Experiment Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from /stimuli to /login for anonymous user', async () => {
            const {container, getByText} = render(
                <MemoryRouter>
                    <Experiment/>
                </MemoryRouter>
            );

            await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/login'));
        });
    });

    describe('User is authenticated as Admin', () => {
        let projectResp;
        let experimentResp;
        let stimuliResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {id: 222, role: 'Admin'}});
            stimuliResp = {
                data: {
                    items: [
                        {id: 1, name: "name 1", description: "test stim 1", experimentId: 1000, link: "link1"},
                        {id: 2, name: "name 2", description: "test stim 2", experimentId: 1000, link: "link2"}
                    ]
                }
            };
            experimentResp = {data: {id: 1000, name: 'test ex 1', description: "test desc 1", projectId: 100}};
            projectResp = {data: {id: 100, name: "test project"}};
        });

        test.skip("Stimuli should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(stimuliResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiment/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/test project/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test ex 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test desc 1/i)).toBeInTheDocument())
        });

        test("Add stimulus should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(stimuliResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiment/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new stimulus/i)).toBeInTheDocument())
        });

    });

    describe('User is authenticated as Researcher', () => {
        let projectResp;
        let experimentResp;
        let stimuliResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {id: 222, role: 'Admin'}});
            stimuliResp = {
                data: {
                    items: [
                        {id: 1, name: "name 1", description: "test stim 1", experimentId: 1000, link: "link1"},
                        {id: 2, name: "name 2", description: "test stim 2", experimentId: 1000, link: "link2"}
                    ]
                }
            };
            experimentResp = {data: {id: 1000, name: 'test ex 1', description: "test desc 1", projectId: 100}};
            projectResp = {data: {id: 100, name: "test project"}};
        });

        test("Add stimulus should be rendered for Researcher", async () => {
            axios.get.mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp).mockResolvedValueOnce(stimuliResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiment/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new stimulus/i)).toBeInTheDocument())
        });
    })
});