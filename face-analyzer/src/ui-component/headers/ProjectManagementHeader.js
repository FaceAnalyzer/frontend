import React from 'react';
import {Box, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import {IconBuildingFactory2} from "@tabler/icons";

// ===========================|| PROJECT HEADER ||=========================== //

const ProjectManagementHeader = () => {
    return (
        <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <IconBuildingFactory2/>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            Project Management
                        </Typography>
                    }/>
                </Box>
            </Box>
        </Card>
    );
};

export default ProjectManagementHeader;