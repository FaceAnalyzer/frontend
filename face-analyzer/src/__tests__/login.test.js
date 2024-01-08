import React from "react";
import {render, waitFor} from "@testing-library/react";
import {MemoryRouter, useNavigate} from "react-router-dom";
import axios from 'axios';

import {useAuth} from "../context/authContext";
import Login3 from "../views/authentication/authentication3/Login3";

const mockedUseNavigate = jest.fn();

jest.mock('../context/authContext');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

describe('Login Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Login should be rendered for anonymous user', async () => {
            const {getAllByText} = render(
                <MemoryRouter>
                    <Login3/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/enter your credentials to continue/i)[0]).toBeInTheDocument())
        });
    });

    describe('User is authenticated as Admin', () => {
        let response;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Admin'}});
            response = {data: {items: [{id: 1, name: 'test 1'}]}};
        });

        test("Redirect from /login to / for Admin", async () => {
            axios.get.mockResolvedValue(response);

            const {container, getByText} = render(
                <MemoryRouter>
                    <Login3/>
                </MemoryRouter>
            );

            await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/'));
        });
    });

    describe('User is authenticated as Researcher', () => {
        let response;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Researcher'}});
            response = {data: {items: [{id: 1, name: 'test 1'}]}};
        });

        test("Redirect from /login to / for Researcher", async () => {
            axios.get.mockResolvedValue(response);

            const {container, getByText} = render(
                <MemoryRouter>
                    <Login3/>
                </MemoryRouter>
            );

            await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/'));
        });
    })
});