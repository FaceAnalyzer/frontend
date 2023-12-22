import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {useParams} from "react-router";
import axios from "axios";
import {GET_EMOTIONS_API, GET_REACTIONS_API} from "../../../endpoints/BackendEndpoints";
import ScatterChart from "./CollectiveChart";

const CollectiveStatistics = () => {
    const {stimuliId} = useParams();
    const [reactionsData, setReactionsData] = useState([]);

    const groupByEmotionType = (data) => {
        const groupedData = {};
        data.forEach((item) => {
            item.items.forEach((entry) => {
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

                const reactionsResponse = await axios.get(GET_REACTIONS_API);
                console.log(reactionsResponse);
                const items = reactionsResponse.data.items.filter((item) => item.stimuliId === ID);

                const data = []
                for (const reaction of items) {
                    const emotions = await axios.get(GET_EMOTIONS_API.replace("{id}", reaction.id));
                    data.push(emotions.data);
                }
                const groupedData = groupByEmotionType(data);
                console.log("Data", data);
                console.log("Grouped data", groupedData);

                Object.keys(groupedData).forEach((emotion) => {
                    groupedData[emotion].sort((a, b) => a.timeOffset - b.timeOffset);
                });

                console.log("Sorted data", groupedData);

                setReactionsData(groupedData);

                //setLoading(false);

            } catch (error) {
                console.error('Error fetching reactions list:', error);
                //setLoading(false); // Set loading to false even in case of an error
            }
        };

        fetchData().then();
    }, [stimuliId]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ScatterChart groupedSortedData={reactionsData}></ScatterChart>
            </Grid>
            <Grid item xs={12}>
                {/* Other components or UI elements */}
            </Grid>
        </Grid>
    );
}

export default CollectiveStatistics;