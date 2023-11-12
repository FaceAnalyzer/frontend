import React from 'react';
import {useTheme} from "@mui/material/styles";
import {Box, Button} from "@mui/material";
import AnimateButton from "../../../ui-component/extended/AnimateButton";

// ===========================|| CHART HEADER ||=========================== //

const ChartHeader = ({activeButton, setActiveButton}) => {
    const theme = useTheme();

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
    };

    return (
        <Box>
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
            </Box>
        </Box>
    );
};

export default ChartHeader;