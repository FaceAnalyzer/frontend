import React from 'react';
import {Box, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import {IconUser} from "@tabler/icons";

// ===========================|| USER HEADER ||=========================== //

const UserManagementHeader = () => {
    return (
        <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <IconUser/>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            User Management
                        </Typography>
                    }/>
                </Box>
            </Box>
        </Card>
    );
};

export default UserManagementHeader;