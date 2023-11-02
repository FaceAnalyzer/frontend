import {useContext} from 'react';
import {AnalysisDataContext} from "./AnalysisContext";

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// styles
const CardWrapper = styled(MainCard)(() => ({
    overflow: 'hidden',
    position: 'relative',
}));

const AnalysisResultsComponent = ({ isLoading }) => {
    const theme = useTheme();
    const {analysisData} = useContext(AnalysisDataContext);

    //emotions = analysisData.getEmotionProbabilities();

    return (
        <>
            {isLoading ? (
                <></>
            ) : (
                <>
                    <CardWrapper border={false} content={false}>
                        <Box sx={{ p: 2 }}>
                            <List sx={{ py: 0 }}>
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
                                                Anger
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[0]} </Typography>}
                                    />
                                </ListItem>
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
                                                Disgust
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[1]} </Typography>}
                                    />
                                </ListItem>
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
                                                Fear
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[2]} </Typography>}
                                    />
                                </ListItem>
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
                                                Happiness
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[3]} </Typography>}
                                    />
                                </ListItem>
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
                                                Sadness
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[4]} </Typography>}
                                    />
                                </ListItem>
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
                                                Surprise
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[5]} </Typography>}
                                    />
                                </ListItem>
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
                                                Neutral
                                            </Typography>
                                        }
                                        secondary={<Typography variant="h4"> {analysisData.getEmotionProbabilities()[6]} </Typography>}
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

export default AnalysisResultsComponent;