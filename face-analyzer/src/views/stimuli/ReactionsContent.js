import React, {useEffect, useState} from 'react';
import {Box, Button, CardHeader, Typography, useMediaQuery} from "@mui/material";
import axios from "axios";
import {GET_REACTIONS_API} from "../../endpoints/BackendEndpoints";
import MainCard from "../../ui-component/cards/MainCard";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import {IconGraph, IconTrashOff} from "@tabler/icons";
import {useTheme} from "@mui/material/styles";
import PropTypes from "prop-types";
import DeleteReactionModal from "../../ui-component/modals/stimuli/DeleteReactionModal";
import {useNavigate} from "react-router-dom";

// ===========================|| REACTIONS HEADER ||=========================== //

const ReactionsContent = ({stimuliId}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [reactionsData, setReactionsData] = useState([]);
    const [, setLoading] = useState(true);
    const [modalData, setModalData] = useState({state: false, reactionId: null});

    const openModal = (reactionId) => {
        setModalData({
            state: true,
            reactionId: reactionId
        });
    }

    const closeModal = () => {
        setModalData({
            state: false,
            reactionId: null
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ID = parseInt(stimuliId);

                const reactionsResponse = await axios.get(GET_REACTIONS_API);
                const items = reactionsResponse.data.items.filter((item) => item.stimuliId === ID);
                setReactionsData(items);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching reactions data:', error);
                setLoading(false); // Set loading to false even in case of an error
            }
        };

        fetchData().then();
    }, [stimuliId]);

    const showStats = (reactionId) => {
        navigate(`/reaction/${reactionId}/statistics`);
    }

    const showCollectiveStats = () => {
        navigate(`/stimuli/${stimuliId}/statistics`);
    }

    return (
        <MainCard
            title={
                <Typography sx={{
                    fontSize: '1.5rem',
                    fontWeight: 500
                }}>
                    Reactions
                </Typography>
            }
            secondary={
                reactionsData && reactionsData.length > 0 && (
                <AnimateButton >
                    <Button
                        id={"button-collective-stats"}
                        disableElevation
                        variant="contained"
                        color="secondary"
                        style={{marginRight: "15px"}}
                        onClick={showCollectiveStats}
                    >
                        <IconGraph/>
                        <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                            Collective Statistics
                        </Typography>
                    </Button>
                </AnimateButton>
                )
            }
        >
            <DeleteReactionModal modalData={modalData} closeModal={closeModal}></DeleteReactionModal>
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
                                id={"button-stats-reaction-" + reaction.id}
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    showStats(reaction.id);
                                }}
                            >
                                <IconGraph/>
                                <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                                    Statistics
                                </Typography>
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                id={"button-delete-reaction-" + reaction.id}
                                sx={{
                                    color: theme.palette.grey[700],
                                    backgroundColor: theme.palette.grey[50],
                                    border: 'solid 1px',
                                    borderColor: theme.palette.grey[700]
                                }}
                                onClick={() => {
                                    openModal(reaction.id);
                                }}
                            >
                                <IconTrashOff/>
                                <Typography sx={{display: isSmallScreen ? 'none' : 'flex'}}>
                                    Delete
                                </Typography>
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