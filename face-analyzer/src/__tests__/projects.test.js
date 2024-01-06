import React from "react";
import Projects from "../views/projects/projects";
import {render} from "@testing-library/react";


jest.mock('../context/authContext');

test('should redirect from projects to login on anon user', () => {
    const {getByText} = render(<Projects/>);

    const loginText = getByText(/enter your credentials to continue/i);
    expect(loginText).toBeInTheDocument();
});

test("should render projects on admin and researcher", () => {
});

test("should render add card on admin", () => {
});

test("should not render add card on researcher", () => {
})