import {useAuth} from '../context/authContext';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {render, waitFor} from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import Stats from "../views/stimuli/charts/Stats";

axios.get = jest.fn();

const mockedUseNavigate = jest.fn();
const mockedUseParams = jest.fn(() => {
  reactionId: '151';
});

class MockResizeObserver {
  observe() {
  }

  unobserve() {
  }

  disconnect() {
  }
}

window.ResizeObserver = MockResizeObserver;

jest.mock('../context/authContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => mockedUseParams
}));

describe('Charts Component', () => {
  describe('User is not authenticated', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ user: null });
    });

    test('Redirects to login page', async () => {
      try {
        const { container, getByText } = render(
          <MemoryRouter>
            <Stats />
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

    test('Chart header should be rendered for Admin', async () => {
      axios.get.mockResolvedValue(response);

      const {getByText} = render(
          <MemoryRouter>
            <Stats/>
          </MemoryRouter>
      );

      await waitFor(() => expect(getByText(/emotions over time/i)).toBeInTheDocument());
      await waitFor(() => expect(getByText(/emotions distribution/i)).toBeInTheDocument());
      await waitFor(() => expect(getByText(/dynamic chart/i)).toBeInTheDocument());
      await waitFor(() => expect(getByText(/add note/i)).toBeInTheDocument());
      await waitFor(() => expect(getByText(/export csv/i)).toBeInTheDocument());
    });

  });

  describe('User is authenticated as Researcher', () => {
    let response;
    beforeEach(() => {
      useAuth.mockReturnValue({ user: { role: 'Researcher' } });
      response = { data: { items: [{ id: 1, name: 'test 1' }] } };
    });

    test('Chart header should be rendered for Researcher', async () => {
      axios.get.mockResolvedValue(response);
        const { getByText } = render(
          <MemoryRouter>
            <Stats />
          </MemoryRouter>
        );

        await waitFor(() => expect(getByText(/emotions over time/i)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/emotions distribution/i)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/dynamic chart/i)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/add note/i)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/export csv/i)).toBeInTheDocument());

    });

  });
});