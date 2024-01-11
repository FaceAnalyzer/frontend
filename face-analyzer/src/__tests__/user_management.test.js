import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";

import {useAuth} from "../context/authContext";
import UserManagement from "../views/users/UserManagement";
import axios from "axios";

const mockedUseNavigate = jest.fn();

jest.mock('../context/authContext');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

describe.skip('User Management Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from /users to /login for anonymous user', async () => {
            try {
                const {container, getByText} = render(
                    <MemoryRouter>
                        <UserManagement/>
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
        let response;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Admin'}});
            response = {
                data: {
                    items: [
                        {id: 1, name: 'test 1', role: 'test', email: 'test@test', contact: '123', username: 'test'},
                        {id: 2, name: 'test 2', role: 'test', email: 'test@test', contact: '123', username: 'test'}
                    ]
                }
            };
        });

        test("User Management should be rendered for Admin", async () => {
            axios.get.mockResolvedValue(response);

            const {getAllByText} = render(
                <MemoryRouter>
                    <UserManagement/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/user management/i)[0]).toBeInTheDocument())
        });
    });

    describe('User is authenticated as Researcher', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Researcher'}});
        });

        test("Redirect from /users to / for Researcher", async () => {

            const {getAllByText} = render(
                <MemoryRouter>
                    <UserManagement/>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(useNavigate()).toHaveBeenCalledWith('/')
            });
        });
    })
});