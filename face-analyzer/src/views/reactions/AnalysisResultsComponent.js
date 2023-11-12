import {useContext} from 'react';
import {AnalysisDataContext} from "./AnalysisDataContext";

// material-ui
import {styled, useTheme} from '@mui/material/styles';
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import PropTypes from "prop-types";

// styles
const CardWrapper = styled(MainCard)(() => ({
    overflow: 'hidden',
    position: 'relative',
}));

const AnalysisResultsComponent = ({ isLoading }) => {
    const theme = useTheme();
    const {analysisData} = useContext(AnalysisDataContext);

    const getLatestData = (index) => {
        return analysisData[index];
    }

    //emotions = analysisData.getEmotionProbabilities();
    const ROUND_TO_DIGITS = 5;

    return (
        <>
            {isLoading ? (
                <></>
            ) : (
                <>
                    <CardWrapper border={false} content={false}>
                        <Box sx={{ p: 2 }}>
                            <List sx={{py: 0, display: 'flex', flexDirection: 'row'}}>
                                {['Anger', 'Disgust', 'Fear', 'Happiness'].map((emotion, index) => (
                                    <ListItem key={index} alignItems="center" disableGutters sx={{py: 0}}>
                                        <ListItemText
                                            sx={{
                                                py: 0,
                                                mt: 0.45,
                                                mb: 0.45
                                            }}
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color: theme.palette.grey[500],
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {emotion}
                                                </Typography>
                                            }
                                            secondary={<Typography
                                                variant="h4"> {getLatestData(index).toFixed(ROUND_TO_DIGITS)} </Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <List sx={{py: 0, display: 'flex', flexDirection: 'row'}}>
                                {['Sadness', 'Surprise', 'Neutral'].map((emotion, index) => (
                                    <ListItem key={index + 4} alignItems="center" disableGutters sx={{py: 0}}>
                                        <ListItemText
                                            sx={{
                                                py: 0,
                                                mt: 0.45,
                                                mb: 0.45
                                            }}
                                            primary={
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color: theme.palette.grey[500],
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {emotion}
                                                </Typography>
                                            }
                                            secondary={<Typography
                                                variant="h4"> {getLatestData(index + 4).toFixed(ROUND_TO_DIGITS)} </Typography>}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                Time
                                            </Typography>
                                        }
                                        secondary={<Typography
                                            variant="h4"> {(getLatestData("time") / 1000).toFixed(ROUND_TO_DIGITS)} s </Typography>}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </CardWrapper>
                </>
            )}
        </>
    );
}

AnalysisResultsComponent.propTypes = {
    isLoading: PropTypes.bool
}

export default AnalysisResultsComponent;