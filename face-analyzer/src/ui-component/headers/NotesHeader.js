import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Card, CardHeader, Link, Typography} from "@mui/material";
import {IconChevronRight, IconClipboardList, IconFlask} from "@tabler/icons";
import {FolderOpen} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

// ===========================|| NOTES HEADER ||=========================== //

const NotesHeader = ({experiment, project}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const experimentId = experiment.id;
    const projectId = project.id;

    const navigateToProject = () => {
        navigate(`/project/${projectId}`);
    }

    const navigateToExperiment = () => {
        navigate(`/experiment/${experimentId}`);
    }

    return (
        <Box>
            <Card sx={{backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                                subheader={
                                    <Box sx={{display: 'flex'}}>
                                        <Link
                                            id={"breadcrumb-to-project"}
                                            sx={{color: theme.palette.grey[500], textDecoration: 'none', cursor: 'pointer'}}
                                            onClick={navigateToProject}
                                        >
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <FolderOpen/>&nbsp;
                                                <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                            </Box>
                                        </Link>
                                        &nbsp;
                                        <IconChevronRight/>
                                        <Link
                                            id={"breadcrumb-to-experiment"}
                                            sx={{color: theme.palette.grey[500], textDecoration: 'none', cursor: 'pointer'}}
                                            onClick={navigateToExperiment}
                                        >
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconFlask/>
                                                <Typography sx={{fontWeight: 500}}>{experiment.name}</Typography>
                                            </Box>
                                        </Link>
                                    </Box>
                                }/>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                            <IconClipboardList/>
                            <CardHeader title={
                                <Typography sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: 500
                                }}>
                                    Notes for {experiment.name}
                                </Typography>
                            }/>
                        </Box>
                    </Box>
                </Box>


            </Card>

        </Box>
    );
};

export default NotesHeader;