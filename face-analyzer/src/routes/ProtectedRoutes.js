import { useContext } from "react";
import { AuthContext } from "context/authProvider";
import { Route, Navigate, Routes } from "react-router-dom";

// This component is a wrapper around the Route component from react-router-dom.
// It is used to create protected routes that can only be accessed by authenticated users with specific roles.
const ProtectedRoute = ({ component: Component, roles, ...rest}) => {
    // Access the userRole value from the AuthContext using the useContext hook.
    const { userRole } = useContext(AuthContext);
    return (
        // Wrap the Route component in a Routes component.
        <Routes>
            <Route {...rest} element={
                // Use the Navigate component instead of Redirect.
                // If the userRole is not defined (user is not authenticated), navigate to the login page.
                !userRole ? <Navigate to={{ pathname: '/login', state: { from: rest.location } }} /> :
                // If the userRole is defined but not included in the allowed roles for the route, navigate to the home page.
                !roles.includes(userRole) ? <Navigate to={{ pathname: '/', state: { from: rest.location } }} /> :
                // If the userRole is defined and included in the allowed roles, render the component passed as prop.
                <Component {...rest} />
            } />
        </Routes>
    )
};

export default ProtectedRoute;