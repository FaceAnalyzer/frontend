import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, Card, CardHeader, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constant";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconGraph, IconTrashOff} from "@tabler/icons";

// ===========================|| STIMULI HEADER ||=========================== //

const StimuliHeader = ({stimulus}) => {
    const theme = useTheme();
    console.log(stimulus)

    const showStats = () => {
        window.location.href = '/statistics';
    }

    return (
        <Box>
            <Card sx={{marginBottom: gridSpacing, backgroundColor: 'inherit'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1.5rem',
                            fontWeight: 500
                        }}>
                            Stimulus Title
                        </Typography>
                    }/>
                    <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={showStats}
                            >
                                <IconGraph/> Statistics
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                sx={{
                                    color: theme.palette.grey[700],
                                    backgroundColor: theme.palette.grey[50],
                                }}
                            >
                                <IconTrashOff/> Delete
                            </Button>
                        </AnimateButton>
                    </Box>
                </Box>
            </Card>

        </Box>
    );
};

export default StimuliHeader;