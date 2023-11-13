import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button, CardHeader, Typography} from "@mui/material";
import AnimateButton from "../../../ui-component/extended/AnimateButton";
import {IconDownload} from "@tabler/icons";

// ===========================|| CHART HEADER ||=========================== //

const ChartHeader = ({activeButton, setActiveButton, emotionsData, reactionData}) => {
    const theme = useTheme();

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
    };

    const downloadCsv = () => {
        console.log(emotionsData);
    };

    return (
        <Box>
            <CardHeader title={
                <Typography sx={{
                    fontSize: '1.5rem',
                    fontWeight: 500
                }}>
                    {reactionData.participantName}
                </Typography>
            }/>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                    <AnimateButton>
                        <Button
                            onClick={() => handleButtonClick('overTime')}
                            sx={activeButton === 'overTime' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'overTime' ? 'contained' : ''}
                            disableElevation
                        >
                            Emotions over time
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button
                            onClick={() => handleButtonClick('distribution')}
                            sx={activeButton === 'distribution' ? {
                                color: theme.palette.secondary
                            } : {
                                color: theme.palette.grey[700],
                                backgroundColor: theme.palette.grey[50],
                            }}
                            variant={activeButton === 'distribution' ? 'contained' : ''}
                            disableElevation
                        >
                            Emotions distribution
                        </Button>
                    </AnimateButton>
                </Box>
                <Box>
                    <AnimateButton>
                        <Button
                            sx={{color: theme.palette.secondary}}
                            variant={'contained'}
                            disableElevation
                            onClick={downloadCsv}
                        >
                            <IconDownload/> Export CSV
                        </Button>
                    </AnimateButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ChartHeader;