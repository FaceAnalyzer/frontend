import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";

import {useAuth} from "../context/authContext";
import axios from "axios";
import ProjectResearchers from "../views/projects/researchers";

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn(() => {
    projectId: "100"
});

jest.mock('../context/authContext');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

describe('Researchers Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from /users to /login for anonymous user', async () => {
            try {
                const {container, getByText} = render(
                    <MemoryRouter>
                        <ProjectResearchers/>
                    </MemoryRouter>
                );
                await waitFor(() => {
                    expect(useNavigate()).toHaveBeenCalledWith('/login')
                });
            } catch (error) {
                expect(error.message).toContain("Cannot read properties of null (reading 'role')");
            }
        });
    });

    describe('User is authenticated as Admin', () => {
        let projectResp;
        let usersOnProjectResp;
        let allUsersResp;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Admin'}});
            projectResp = {data: {id: 100, name: "test project"}};
            usersOnProjectResp = {
                data: {
                    items: [
                        {id: 1, name: 'test 1', role: 'test', email: 'test@test', contact: '123', username: 'test'}
                    ]
                }
            };
            allUsersResp = {
                data: {
                    items: [
                        {id: 1, name: 'test 1', role: 'test', email: 'test@test', contact: '123', username: 'test'},
                        {id: 2, name: 'test 2', role: 'test', email: 'test@test', contact: '123', username: 'test'}
                    ]
                }
            };
        });

        test("Project Researchers should be rendered for Admin", async () => {
            axios.get.mockResolvedValueOnce(projectResp).mockResolvedValueOnce(usersOnProjectResp).mockResolvedValueOnce(allUsersResp);

            const {getAllByText} = render(
                <MemoryRouter>
                    <ProjectResearchers/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/project researchers/i)[0]).toBeInTheDocument())
        });
    });

    describe('User is authenticated as Researcher', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Researcher'}});
        });

        test("Redirect from /users to / for Researcher", async () => {

            const {getAllByText} = render(
                <MemoryRouter>
                    <ProjectResearchers/>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(useNavigate()).toHaveBeenCalledWith('/')
            });
        });
    })
});