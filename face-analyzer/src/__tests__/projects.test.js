import React from "react";
import Projects from "../views/projects/projects";
import {render} from "@testing-library/react";
import AuthProvider from "../context/authContext";
import {BrowserRouter} from "react-router-dom";

test('should redirect from projects to login on anon user', () => {
    jest.mock('../context/authContext', () => ({
        useAuth: () => {
            return {
                user: undefined,
                token: undefined
            }
        }
    }));

    const {getByText} = render(
        <Projects/>,
        {
            wrapper: ({children}) => (
                <BrowserRouter>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </BrowserRouter>
            )
        }
    );

    const loginText = getByText(/enter your credentials to continue/i);
    expect(loginText).toBeInTheDocument();
});

test("should render projects on admin and researcher", () => {
});

test("should render add card on admin", () => {
});

test("should not render add card on researcher", () => {
})