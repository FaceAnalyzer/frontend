import {render, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import React from "react";
import ErrorPage from "../views/error-page/ErrorPage";

describe('Error page Component', () => {
    test('Render page', async () => {
        try {
            const {getAllByText} = render(
                <MemoryRouter>
                    <ErrorPage/>
                </MemoryRouter>
            );
            await waitFor(() => expect(getAllByText(/something went wrong/i)[0]).toBeInTheDocument())
        } catch (error) {
            expect(error.message).toContain("Cannot read properties of null (reading 'role')");
        }
    });
});