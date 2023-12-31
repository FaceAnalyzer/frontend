import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {useParams} from "react-router";
import axios from "axios";
import {
    GET_EMOTIONS_API,
    GET_EXPERIMENT_BY_ID_API, GET_PROJECT_BY_ID_API,
    GET_REACTIONS_API,
    GET_STIMULI_BY_ID_API
} from "../../../endpoints/BackendEndpoints";
import CollectiveChart from "./CollectiveChart";
import CollectiveChartHeader from "../../../ui-component/headers/CollectiveChartHeader";

const CollectiveStatistics = () => {
    const {stimuliId} = useParams();
    const [reactionsData, setReactionsData] = useState([]);
    const [stimuliData, setStimuliData] = useState({});
    const [experimentData, setExperimentData] = useState({});
    const [projectData, setProjectData] = useState({});
    const [reactionList, setReactionList] = useState([]);

    const groupByEmotionType = (data) => {
        const groupedData = {};
        data.forEach((item) => {
            item.emotions.forEach((entry) => {
                const { emotionType } = entry;
                if (!groupedData[emotionType]) {
                    groupedData[emotionType] = [];
                }
                groupedData[emotionType].push(entry);
            })
        });
        return groupedData;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ID = parseInt(stimuliId);

                const stimuliResponse = await axios.get(GET_STIMULI_BY_ID_API.replace('{id}', ID.toString()));
                const stimuliItem = stimuliResponse.data;
                setStimuliData(stimuliItem);

                const experimentResponse = await axios.get(GET_EXPERIMENT_BY_ID_API.replace('{id}', stimuliItem.experimentId));
                const experimentItem = experimentResponse.data;
                setExperimentData(experimentItem);

                const projectResponse = await axios.get(GET_PROJECT_BY_ID_API.replace('{id}', experimentItem.projectId));
                const projectItem = projectResponse.data;
                setProjectData(projectItem);

                const reactionsResponse = await axios.get(GET_REACTIONS_API);
                const reactionsToStimuli = reactionsResponse.data.items.filter((item) => item.stimuliId === ID);
                setReactionList(reactionsToStimuli);

                const data = []
                for (const reaction of reactionsToStimuli) {
                    const emotions = await axios.get(GET_EMOTIONS_API.replace("{id}", reaction.id));
                    data.push(emotions.data);
                }
                const groupedData = groupByEmotionType(data);

                Object.keys(groupedData).forEach((emotion) => {
                    groupedData[emotion].sort((a, b) => a.timeOffset - b.timeOffset);
                });

                setReactionsData(groupedData);
            } catch (error) {
                console.error('Error fetching reactions list:', error);
            }
        };

        fetchData().then();
    }, [stimuliId]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CollectiveChartHeader
                             stimuliData={stimuliData}
                             experimentData={experimentData}
                             projectData={projectData}
                             reactionList={reactionList}
                />
            </Grid>
            <Grid item xs={12}>
                <CollectiveChart groupedSortedData={reactionsData}></CollectiveChart>
            </Grid>
            <Grid item xs={12}>
                {/* Other components or UI elements */}
            </Grid>
        </Grid>
    );
}

export default CollectiveStatistics;