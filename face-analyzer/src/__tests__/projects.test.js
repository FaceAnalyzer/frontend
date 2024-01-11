import React from "react";
import {render, waitFor} from "@testing-library/react";
import Projects from "../views/projects/Projects";
import {MemoryRouter, useNavigate} from "react-router-dom";
import axios from 'axios';

import {useAuth} from "../context/authContext";

const mockedUseNavigate = jest.fn();

jest.mock('../context/authContext');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}));

describe('Projects Component', () => {
    describe('User is not authenticated', () => {
        beforeEach(() => {
            useAuth.mockReturnValue({user: null});
        });

        test('Redirect from /projects to /login for anonymous user', async () => {
            const {container, getByText} = render(
                <MemoryRouter>
                    <Projects/>
                </MemoryRouter>
            );

            await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/login'));
        });
    });

    describe('User is authenticated as Admin', () => {
        let response;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Admin'}});
            response = {data:{items:[{id: 1, name: 'test 1'}, {id: 2, name: 'test 2'}]}};
        });

        test("Projects should be rendered for Admin", async () => {
            axios.get.mockResolvedValue(response);

            const {getAllByText} = render(
                <MemoryRouter>
                    <Projects/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/find all your project items here/i)[0]).toBeInTheDocument())
        });

        test("Add card should be rendered for Admin", async () => {
            axios.get.mockResolvedValue(response);

            const {getByText} = render(
                <MemoryRouter>
                    <Projects/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getByText(/click to add a new project/i)).toBeInTheDocument())
        });
    });

    describe('User is authenticated as Researcher', () => {
        let response;
        beforeEach(() => {
            useAuth.mockReturnValue({user: {role: 'Researcher'}});
            response = {data:{items:[{id: 1, name: 'test 1'}, {id: 2, name: 'test 2'}]}};
        });

        test("Projects should be rendered for Researcher", async () => {
            axios.get.mockResolvedValue(response);

            const {getAllByText} = render(
                <MemoryRouter>
                    <Projects/>
                </MemoryRouter>
            );

            await waitFor(() => expect(getAllByText(/find all your project items here/i)[0]).toBeInTheDocument())
        });

        test("Add card should not be rendered for Researcher", async () => {
            axios.get.mockResolvedValue(response);

            const {queryByText} = render(
                <MemoryRouter>
                    <Projects/>
                </MemoryRouter>
            );

            await waitFor(() => expect(queryByText(/click to add a new project/i)).toBeNull())
        })
    })
});