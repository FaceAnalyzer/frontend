import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";

import {useAuth} from "../context/authContext";
import Dashboard from "../views/dashboard";

const mockedUseNavigate = jest.fn();

jest.mock('../context/authContext');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

describe('Dashboard Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from / to /login for anonymous user', async () => {
            try {
                const {container, getByText} = render(
                    <MemoryRouter>
                        <Dashboard/>
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
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Admin'}});
        });

        test("Dashboard should be rendered for Admin", async () => {

            const {getAllByText} = render(
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/find all your functionalities here/i)[0]).toBeInTheDocument())
        });

        test("Projects card should be rendered for Admin", async () => {

            const {getByText} = render(
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/view all projects/i)).toBeInTheDocument())
        });

        test("Users card should be rendered for Admin", async () => {

            const {getByText} = render(
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/view all users/i)).toBeInTheDocument())
        });
    });

    describe('User is authenticated as Researcher', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Researcher'}});
        });

        test("Dashboard should be rendered for Researcher", async () => {

            const {getAllByText} = render(
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/find all your functionalities here/i)[0]).toBeInTheDocument())
        });

        test("Projects card should be rendered for Researcher", async () => {

            const {getByText} = render(
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/view all projects/i)).toBeInTheDocument())
        });

        test("Users card should not be rendered for Researcher", async () => {

            const {queryByText} = render(
                <MemoryRouter>
                    <Dashboard/>
                </MemoryRouter>
            );

            await waitFor(() => expect(queryByText(/view all users/i)).toBeNull())
        });
    })
});