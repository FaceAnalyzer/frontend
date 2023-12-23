import React from 'react';
import {Box, Card, CardHeader, Typography} from "@mui/material";
import {useAuth} from "../../context/authContext";

// ===========================|| DASHBOARD HEADER ||=========================== //

const DashboardHeader = () => {
    const {user} = useAuth();

    return (
        <Card sx={{backgroundColor: 'inherit'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            Hello, {user ? user.name : "Anonymous"}!
                        </Typography>
                    } subheader={
                        <Typography>
                            {!user ? "Please login to access all functionalities." : "Find all your functionalities here."}
                        </Typography>
                    }/>
                </Box>
            </Box>
        </Card>
    );
};

export default DashboardHeader;