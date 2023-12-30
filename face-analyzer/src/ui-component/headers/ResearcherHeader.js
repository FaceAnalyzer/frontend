import React from 'react';
import {Box, Card, CardHeader, Link, Typography} from "@mui/material";
import {FolderOpen, Troubleshoot} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

// ===========================|| PROJECT RESEARCHERS HEADER ||=========================== //

const ProjectResearcherHeader = ({data}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const project = data;
    const projectId = project.id;

    const navigateToProject = () => {
        navigate(`/project/${projectId}`);
    }

    return (
        <Box>
            <Card sx={{backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                                subheader={
                                    <Link
                                        id={"breadcrumb-to-project"}
                                        sx={{color: theme.palette.grey[500], textDecoration: 'none', cursor: 'pointer'}}
                                        onClick={navigateToProject}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <FolderOpen/>
                                            <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                        </Box>
                                    </Link>
                                }/>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                            <Troubleshoot/>
                            <CardHeader title={
                                <Typography sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 500
                                }}>
                                    Project Researchers
                                </Typography>
                            }/>
                        </Box>
                    </Box>
                </Box>
            </Card>

        </Box>
    );
};

ProjectResearcherHeader.propTypes = {
    data: PropTypes.object
}

export default ProjectResearcherHeader;