// import React from "react";
// import {render, waitFor} from "@testing-library/react";
// import {MemoryRouter, useNavigate} from "react-router-dom";
// import axios from 'axios';
//
// import {useAuth} from "../context/authContext";
// import Experiments from "../views/experiments";
// import {useParams} from "react-router";
//
// const mockedUseNavigate = jest.fn();
// const mockedUseParams = jest.fn();
//
// jest.mock('../context/authContext');
// jest.mock('axios');
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockedUseNavigate,
// }));
//
// jest.mock('react-router', () => ({
//     ...jest.requireActual('react-router'),
//     useParams: () => mockedUseParams
// }));
//
// describe('Experiments Component', () => {
//     describe('User is not authenticated', () => {
//         beforeEach(() => {
//             useAuth.mockReturnValue({user: null});
//         });
//
//         test('Redirect from experiments to /login for anonymous user', async () => {
//             const {container, getByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(useNavigate()).toHaveBeenCalledWith('/login'));
//         });
//     });
//
//     describe('User is authenticated as Admin', () => {
//         let experimentsResp;
//         let projectResp;
//         beforeEach(() => {
//             useAuth.mockReturnValue({user: {role: 'Admin'}});
//             useParams.mockReturnValue({projectId: 1});
//             experimentsResp = {
//                 data: {
//                     items: [
//                         {id: 1, name: 'test_exp_1', description: 'test_desc_1', projectId: 1},
//                         {id: 2, name: 'test_exp_2', description: 'test_desc_2', projectId: 1}
//                     ]
//                 }
//             };
//             projectResp = {data: {id: 1, name: 'project test name'}};
//         });
//
//         test("Experiments for project 'test name' should be rendered for Admin", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {queryByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//             await waitFor(() => expect(queryByText(/project test name/i)).toBeInTheDocument())
//
//         });
//
//         test("Add experiment card should be rendered for Admin", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {getByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(getByText(/click to add a new experiment/i)).toBeInTheDocument())
//         });
//
//         test("Experiment cards should be rendered for Admin", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {queryByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(queryByText(/test_exp_1/i)).toBeInTheDocument())
//             await waitFor(() => expect(queryByText(/test_exp_2/i)).toBeInTheDocument())
//             await waitFor(() => expect(queryByText(/test_desc_1/i)).toBeInTheDocument())
//             await waitFor(() => expect(queryByText(/test_desc_1/i)).toBeInTheDocument())
//         });
//
//         test("Edit researchers button should be rendered for Admin", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {queryByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(queryByText(/edit researchers/i)).toBeInTheDocument())
//         });
//     });
//
//     describe('User is authenticated as Researcher', () => {
//         let experimentsResp;
//         let projectResp;
//         beforeEach(() => {
//             useAuth.mockReturnValue({user: {role: 'Researcher'}});
//             useParams.mockReturnValue({projectId: 1});
//             experimentsResp = {
//                 data: {
//                     items: [
//                         {id: 1, name: 'test_exp_1', description: 'test_desc_1', projectId: 1},
//                         {id: 2, name: 'test_exp_2', description: 'test_desc_2', projectId: 1}
//                     ]
//                 }
//             };
//             projectResp = {data: {id: 1, name: 'project test name'}};
//         });
//
//         test("Experiments for project 'test name' should be rendered for Researchers", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {queryByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//             await waitFor(() => expect(queryByText(/project test name/i)).toBeInTheDocument())
//
//         });
//
//         test("Add experiment card should be rendered for Researcher", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {getByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(getByText(/click to add a new experiment/i)).toBeInTheDocument())
//         });
//
//         test("Experiment cards should be rendered for Researcher", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {queryByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(queryByText(/test_exp_1/i)).toBeInTheDocument())
//             await waitFor(() => expect(queryByText(/test_exp_2/i)).toBeInTheDocument())
//             await waitFor(() => expect(queryByText(/test_desc_1/i)).toBeInTheDocument())
//             await waitFor(() => expect(queryByText(/test_desc_1/i)).toBeInTheDocument())
//         });
//
//         test("Edit researchers button should not be rendered for Researcher", async () => {
//             axios.get.mockResolvedValueOnce(experimentsResp).mockResolvedValueOnce(projectResp);
//
//             const {queryByText} = render(
//                 <MemoryRouter>
//                     <Experiments/>
//                 </MemoryRouter>
//             );
//
//             await waitFor(() => expect(queryByText(/edit researchers/i)).toBeNull())
//         });
//     })
// });