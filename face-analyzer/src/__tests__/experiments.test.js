import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import axios from 'axios';

import {useAuth} from "../context/authContext";
import Experiments from "../views/projects/Experiments";

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn(() => {
    projectId: 100
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

describe('Experiments Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from /experiments to /login for anonymous user', async () => {
            const {container, getByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/login'));
        });
    });

    describe('User is authenticated as Admin', () => {
        let projectResp;
        let experimentsResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Admin'}});
            experimentsResp = {
                data: {
                    items: [
                        {id: 1, name: 'test ex 1', description: "test desc 1", projectId: 100},
                        {id: 2, name: 'test ex 2', description: "test desc 2", projectId: 100}
                    ]
                }
            };
            projectResp = {data: {id: 100, name: "test project"}}
        });

        test("Experiments should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/test ex 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test ex 2/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test desc 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test desc 2/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test project/i)).toBeInTheDocument())
        });

        test("Add card should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new experiment/i)).toBeInTheDocument())
        });

        test("Edit researchers button should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/edit researchers/i)).toBeInTheDocument())
        });
    });

    describe('User is authenticated as Researcher', () => {
        let projectResp;
        let experimentsResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Researcher'}});
            experimentsResp = {
                data: {
                    items: [
                        {id: 1, name: 'test ex 1', description: "test desc 1", projectId: 100},
                        {id: 2, name: 'test ex 2', description: "test desc 2", projectId: 100}
                    ]
                }
            };
            projectResp = {data: {id: 100, name: "test project"}}
        });

        test("Experiments should be rendered for Researcher", async () => {
            axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/test ex 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test ex 2/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test desc 1/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test desc 2/i)).toBeInTheDocument())
            await waitFor(() => expect(getByText(/test project/i)).toBeInTheDocument())
        });

        test("Add card should be rendered for Researcher", async () => {
            axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);

            const {getByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new experiment/i)).toBeInTheDocument())
        });

        test("Edit researchers button should not be rendered for Researcher", async () => {
            axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);

            const {queryByText} = render(
                <MemoryRouter>
                    <Experiments/>
                </MemoryRouter>
            );

            await waitFor(() => expect(queryByText(/edit researchers/i)).toBeNull())
        });
    })
});