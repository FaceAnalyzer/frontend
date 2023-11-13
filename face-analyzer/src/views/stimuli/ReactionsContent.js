import React, {useEffect, useState} from 'react';
import {Box, Button, CardHeader, Typography} from "@mui/material";
import axios from "axios";
import {GET_REACTIONS_API} from "../projects/BackendEndpoints";
import MainCard from "../../ui-component/cards/MainCard";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconGraph, IconTrashOff} from "@tabler/icons";
import {useTheme} from "@mui/material/styles";
import PropTypes from "prop-types";

// ===========================|| REACTIONS HEADER ||=========================== //

const ReactionsContent = ({stimuliId}) => {
    const theme = useTheme();
    const [reactionsData, setReactionsData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ID = parseInt(stimuliId);

                const reactionsResponse = await axios.get(GET_REACTIONS_API);
                console.log("reactions", reactionsResponse);
                const items = reactionsResponse.data.items.filter((item) => item.stimuliId === ID);
                setReactionsData(items);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching reactions data:', error);
                setLoading(false); // Set loading to false even in case of an error
            }
        };

        fetchData();
    }, [stimuliId]);

    console.log(isLoading);
    console.log(reactionsData);

    const showStats = (reactionId) => {
        window.location.href = '/reaction/' + reactionId + '/statistics';
    }

    return (
        <MainCard title={
            <Typography sx={{
                fontSize: '1.5rem',
                fontWeight: 500
            }}>
                Reactions
            </Typography>
        }>
            {reactionsData && reactionsData.map((reaction) => (
                <Box key={reaction.id}
                     sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <CardHeader title={
                        <Typography sx={{
                            fontSize: '1rem',
                            fontWeight: 200
                        }}>
                            {reaction.participantName}
                        </Typography>
                    }/>
                    <Box sx={{display: 'flex', gap: 1, pr: 2}}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    showStats(reaction.id)
                                }}
                            >
                                <IconGraph/> Statistics
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                sx={{
                                    color: theme.palette.grey[700],
                                    backgroundColor: theme.palette.grey[50],
                                    border: 'solid 1px',
                                    borderColor: theme.palette.grey[700]
                                }}
                            >
                                <IconTrashOff/> Delete
                            </Button>
                        </AnimateButton>
                    </Box>
                </Box>
            ))}
        </MainCard>

    );
};

ReactionsContent.propTypes = {
    stimuliId: PropTypes.number
}

export default ReactionsContent;