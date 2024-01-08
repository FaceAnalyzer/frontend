import React from 'react';
import { Button, Typography } from '@mui/material';
import PropTypes from "prop-types";

const ErrorPage = ({error, resetErrorBoundary}) => {
    console.error("An error caused the Error page to show:", error);
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h4" color="error" gutterBottom>
                Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                We apologize for the inconvenience. Please try again later.
            </Typography>
            <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
                Go Back to Homepage
            </Button>
        </div>
    );
};

ErrorPage.propTypes = {
    error: PropTypes.object,
    resetErrorBoundary: PropTypes.func,
}

export default ErrorPage;
