import React, {useEffect, useState} from 'react';

// material-ui
import {Grid} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import ChartHeader from "./ChartHeader";
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
// ==============================|| STATISTICS DASHBOARD ||============================== //

const Stats = () => {
    // const theme = useTheme();
    const {reactionId} = useParams();
    const [groupedSortedData, setGroupedSortedData] = useState([]);
    const [emotionsData, setEmotionsData] = useState({});
    const [reactionData, setReactionData] = useState({});
    const [stimuliData, setStimuliData] = useState({});
    const [experimentData, setExperimentData] = useState({});
    const [projectData, setProjectData] = useState({});
    const [reactionDuration, setReactionDuration] = useState(0);

    const [isLoading, setLoading] = useState(true);
    console.log(isLoading); //stop lint errors

    const [activeButton, setActiveButton] = useState('overTime');

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

        const fetchData = async () => {
            try {
                const ID = parseInt(reactionId);


                const reactionResponse = await axios.get(GET_REACTIONS_BY_ID_API.replace('{id}', reactionId));
                const reactionItem = reactionResponse.data;
                setReactionData(reactionItem);

                const stimuliResponse = await axios.get(GET_STIMULI_BY_ID_API.replace('{id}', reactionItem.stimuliId));
                const stimuliItem = stimuliResponse.data;
                setStimuliData(stimuliItem);

                const experimentResponse = await axios.get(GET_EXPERIMENT_BY_ID_API.replace('{id}', stimuliItem.experimentId));
                const experimentItem = experimentResponse.data;
                setExperimentData(experimentItem);

                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace('{id}', experimentItem.projectId));
                const projectItem = projectResponse.data;
                setProjectData(projectItem);

                const emotionsResponse = await axios.get(GET_EMOTIONS_API.replace('{id}', reactionId));
                console.log("emotions", emotionsResponse);
                const items = emotionsResponse.data.items.filter((item) => item.reactionId === ID);

                const groupedAndSortedData = groupAndSortEmotionData(items);

                setGroupedSortedData(groupedAndSortedData);
                console.log("data", groupedAndSortedData);

                setEmotionsData(groupedAndSortedData);

                //Set reaction duration in seconds
                setReactionDuration(groupedAndSortedData['Anger'][groupedAndSortedData['Anger'].length - 1].timeOffset / 1000);

                setLoading(false);

            } catch (error) {
                console.error('Error fetching reactions data:', error);
                setLoading(false); // Set loading to false even in case of an error
            }
        };

        fetchData();
    }, [reactionId]);

    return (
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
                    <EmotionsOverTimeChart groupedSortedData={groupedSortedData}/>
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
                        <BoxPlotChart boxPlotData={emotionsData}/>
                    </Grid>
                    <Grid item lg={5} md={12} sm={12} xs={12}>
                        <BoxPlotLegend/>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Stats;
