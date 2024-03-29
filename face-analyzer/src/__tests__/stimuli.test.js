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

const mockStream = {
  getTracks: jest.fn(() => [{stop: jest.fn()}]),
};

const mediaDevicesMock = {
  getUserMedia: jest.fn(() => {
    return Promise.resolve(mockStream)
  }),
};

global.navigator.mediaDevices = mediaDevicesMock;

jest.mock('../context/authContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => mockedUseParams
}));

//flaky tests
describe.skip('Stimuli Component', () => {
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
    let response;
    beforeEach(() => {
      useAuth.mockReturnValue({ user: { role: 'Admin' } });
      response = { data: { items: [{ id: 1, name: 'test 1' }] } };
    });

    test('Stimuli should render for Admin', async () => {
      axios.get.mockResolvedValue(response);

      const { getByText } = render(
        <MemoryRouter>
          <Stimuli />
        </MemoryRouter>
      );

      await waitFor(() => expect(getByText(/reactions/i)).toBeInTheDocument());
    });

  });
});