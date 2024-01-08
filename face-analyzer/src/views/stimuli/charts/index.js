import React, {useEffect, useState} from 'react';

// material-ui
import {Grid, Typography} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import ChartHeader from "../../../ui-component/headers/ChartHeader";
import BoxPlotChart from "./BoxPlotChart";
import BoxPlotLegend from "./BoxPlotLegend";
import {useParams} from "react-router";
import axios from "axios";
import EmotionsOverTimeChart from "./EmotionsOverTimeChart";
import {
    GET_EMOTIONS_API,
    GET_EXPERIMENT_BY_ID_API,
    GET_PROJECT_BY_ID_API,
    GET_REACTIONS_BY_ID_API,
    GET_STIMULI_BY_ID_API
} from "../../../endpoints/BackendEndpoints";
import {useAuth} from "../../../context/authContext";
import DynamicChart from "./DynamicChart";
import {useNavigate} from "react-router-dom";
// ==============================|| STATISTICS DASHBOARD ||============================== //

const Stats = () => {
    const navigate = useNavigate();
    // const theme = useTheme();
    const {reactionId} = useParams();
    const [groupedSortedData, setGroupedSortedData] = useState({});
    const [emotionsData, setEmotionsData] = useState({});
    const [reactionData, setReactionData] = useState({});
    const [stimuliData, setStimuliData] = useState({});
    const [experimentData, setExperimentData] = useState({});
    const [projectData, setProjectData] = useState({});
    const [reactionDuration, setReactionDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const {user} = useAuth();

    const [activeButton, setActiveButton] = useState('dynamic');

    const groupAndSortEmotionData = (emotionData) => {
        const groupedData = emotionData.reduce((result, data) => {
            const emotion = data.emotionType;
            if (!result[emotion]) {
                result[emotion] = [];
            }
            result[emotion].push(data);
            return result;
        }, {});

        Object.keys(groupedData).forEach((emotion) => {
            groupedData[emotion].sort((a, b) => a.timeOffset - b.timeOffset);
        });

        return groupedData;
    };

    useEffect(() => {

        const parseYoutubeLink = (link) => {
            const videoIdMatch = link.match(/(?:v=|\/)([\w-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if(videoId) {
                return [`https://www.youtube.com/embed/${videoId}`, videoId];
            }
            else{
                console.error("Invalid link:", link);
            }
        }

        const fetchData = async () => {

            try {
                const ID = parseInt(reactionId);

                const reactionResponse = await axios.get(GET_REACTIONS_BY_ID_API.replace('{id}', reactionId));
                const reactionItem = reactionResponse.data;
                setReactionData(reactionItem);

                const stimuliResponse = await axios.get(GET_STIMULI_BY_ID_API.replace('{id}', reactionItem.stimuliId));
                const stimuliItem = stimuliResponse.data;
                const [link, videoId] = parseYoutubeLink(stimuliItem.link);
                stimuliItem.link = link;
                stimuliItem.videoId = videoId;
                setStimuliData(stimuliItem);

                const experimentResponse = await axios.get(GET_EXPERIMENT_BY_ID_API.replace('{id}', stimuliItem.experimentId));
                const experimentItem = experimentResponse.data;
                setExperimentData(experimentItem);

                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace('{id}', experimentItem.projectId));
                const projectItem = projectResponse.data;
                setProjectData(projectItem);

                const emotionsResponse = await axios.get(GET_EMOTIONS_API.replace('{id}', reactionId));
                const items = emotionsResponse.data.emotions.filter((item) => item.reactionId === ID);

                const groupedAndSortedData = groupAndSortEmotionData(items);

                setGroupedSortedData(groupedAndSortedData);

                setEmotionsData(groupedAndSortedData);

                //Set reaction duration in seconds
                setReactionDuration(groupedAndSortedData['Anger'][groupedAndSortedData['Anger'].length - 1].timeOffset / 1000);
                setIsLoading(false);

            } catch (error) {
                console.error('Error fetching reactions data:', error);
            }
        };

        if (user) {
            fetchData().then();
        } else {
            navigate("/login");
        }

    }, [reactionId, user, navigate]);

    return !user ? (<></>) : (
        <Grid container spacing={gridSpacing} sx={{padding: '16px'}}>
            <Grid item xs={12}>
                <ChartHeader activeButton={activeButton}
                             setActiveButton={setActiveButton}
                             emotionsData={emotionsData}
                             reactionData={reactionData}
                             stimuliData={stimuliData}
                             experimentData={experimentData}
                             projectData={projectData}
                />
            </Grid>
            {activeButton === 'overTime' && (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <EmotionsOverTimeChart isLoading={isLoading} groupedSortedData={groupedSortedData}/>
                </Grid>
            )}
            {activeButton === 'distribution' && (
                <>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Typography variant="subtitle1" marginRight={2}>
                            Reaction duration: {reactionDuration}s
                        </Typography>
                    </Grid>
                    <Grid item lg={7} md={12} sm={12} xs={12}>
                        <BoxPlotChart isLoading={isLoading} boxPlotData={emotionsData}/>
                    </Grid>
                    <Grid item lg={5} md={12} sm={12} xs={12}>
                        <BoxPlotLegend/>
                    </Grid>
                </>
            )}
            {activeButton === 'dynamic' && (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <DynamicChart isLoading={isLoading} stimuliData={stimuliData} groupedSortedData={groupedSortedData}/>
                </Grid>
            )}
        </Grid>
    );
};

export default Stats;
