import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Card, CardHeader, Link, Typography} from "@mui/material";
import {IconChevronRight, IconClipboardList, IconFileAnalytics, IconFlask} from "@tabler/icons";
import {gridSpacing} from "../../../store/constant";

// ===========================|| NOTES HEADER ||=========================== //

const NotesHeader = ({experiment, project}) => {
    const theme = useTheme();

    const experimentId = experiment.id;
    const projectId = project.id;

    return (
        <Box>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardHeader sx={{padding: '5px'}}
                                subheader={
                                    <Box sx={{display: 'flex'}}>
                                        <Link href={`/project/${projectId}`}
                                              sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
                                        >
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconFileAnalytics/>
                                                <Typography sx={{fontWeight: 500}}>{project.name}</Typography>
                                            </Box>
                                        </Link>
                                        &nbsp;
                                        <IconChevronRight/>
                                        <Link href={`/experiment/${experimentId}`}
                                              sx={{color: theme.palette.grey[500], textDecoration: 'none'}}
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