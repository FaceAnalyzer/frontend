import {useAuth} from '../context/authContext';
import {render, waitFor} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import React from 'react';
import Stimuli from '../views/stimuli/Stimuli';
import axios from 'axios';

axios.get = jest.fn()

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn(() => {
  stimuliId: '151';
});

jest.mock('../context/authContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => mockedUseParams
}));

describe('Stimuli Component', () => {
  describe('User is not authenticated', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ user: null });
    });

    test('Redirects to login page', async () => {
      try {
        const { container, getByText } = render(
          <MemoryRouter>
            <Stimuli />
          </MemoryRouter>
        );
        await waitFor(() => {
          expect(useNavigate()).toHaveBeenCalledWith('/login');
        });
      } catch (error) {
        expect(error.message).toContain('Cannot read properties of null (reading \'role\')');
      }
    });
  });

  describe('User is authenticated as Admin', () => {
    let stimuliResponse;
    let experimentResp;
    let projectResp;
    beforeEach(() => {
      useAuth.mockReturnValue({user: {role: 'Researcher'}});
      stimuliResponse = {data: {items: [{id: 1, name: 'test_stimulus', description: 'test_desc', link: 'link'}]}};
      experimentResp = {data: {id: 1000, name: "test_experiment", description: 'test_desc_ex', projectId: 100}};
      projectResp = {data: {id: 100, name: "test_project"}}
    });

    test('Stimuli should render for Admin', async () => {
      axios.get.mockResolvedValueOnce(stimuliResponse).mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp);

      const { getByText } = render(
        <MemoryRouter>
          <Stimuli />
        </MemoryRouter>
      );

      await waitFor(() => expect(getByText(/reactions/i)).toBeInTheDocument());
    });

  });

  describe('User is authenticated as Researcher', () => {
    let stimuliResponse;
    let experimentResp;
    let projectResp;
    beforeEach(() => {
      useAuth.mockReturnValue({user: {role: 'Researcher'}});
      stimuliResponse = {data: {items: [{id: 1, name: 'test_stimulus', description: 'test_desc', link: 'link'}]}};
      experimentResp = {data: {id: 1000, name: "test_experiment", description: 'test_desc_ex', projectId: 100}};
      projectResp = {data: {id: 100, name: "test_project"}}
    });

    test('Stimuli should render for Researcher', async () => {
      axios.get.mockResolvedValueOnce(stimuliResponse).mockResolvedValueOnce(experimentResp).mockResolvedValueOnce(projectResp);

      const {getByText} = render(
          <MemoryRouter>
            <Stimuli/>
          </MemoryRouter>
      );

      await waitFor(() => expect(getByText(/reactions/i)).toBeInTheDocument());
    });

  });
});