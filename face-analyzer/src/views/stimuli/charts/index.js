import React, {useEffect, useState} from 'react';

// material-ui
import {Grid, Typography} from '@mui/material';

// project imports
import {gridSpacing} from 'store/constant';
import Chart from "react-apexcharts";
import ChartHeader from "./ChartHeader";
import BoxPlotChart from "./BoxPlotChart";
import BoxPlotLegend from "./BoxPlotLegend";
import {useParams} from "react-router";
import axios from "axios";
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
    const [lineChartData, setLineChartData] = useState([]);
    const [emotionsData, setEmotionsData] = useState({});
    const [reactionData, setReactionData] = useState({});
    const [stimuliData, setStimuliData] = useState({});
    const [experimentData, setExperimentData] = useState({});
    const [projectData, setProjectData] = useState({});

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

    const createChartConfigs = (emotionColor, groupedData) => {
        return Object.keys(groupedData).map((emotion) => {
            const values = groupedData[emotion].map((item) => item.value);

            return {
                type: 'line',
                height: 50,
                options: {
                    chart: {
                        sparkline: {
                            enabled: true
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    colors: [emotionColor[emotion]],
                    fill: {
                        type: 'solid',
                        opacity: 1
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    yaxis: {
                        min: 0,
                        max: 1,
                        title: {
                            text: emotion,
                        },
                        labels: {
                            show: true,
                        },
                    },
                    tooltip: {
                        theme: 'dark',
                        fixed: {
                            enabled: false
                        },
                        x: {
                            show: false
                        },
                        y: {
                            title: emotion
                        },
                        marker: {
                            show: false
                        }
                    },
                    annotations: {
                        strokeDashArray: 0,
                        borderColor: '#000',
                        borderWidth: 100,
                        xaxis: [{
                            x: 0,
                            strokeDashArray: 0,
                        }]
                    }
                },
                series: [{
                    name: emotion,
                    data: values
                }]
            };
        });
    };

    useEffect(() => {

        const emotionColor = {
            'Anger': '#ff0000',
            'Disgust': '#ffa500',
            'Fear': '#800080',
            'Happiness': '#00ff00',
            'Sadness': '#0000ff',
            'Surprise': '#ffff00',
            'Neutral': '#000'
        };

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

                //Temporary workaround
                /*
                const reactionResponse = await axios.get(GET_REACTIONS_API);
                const reaction = reactionResponse.data.items.filter((item) => item.id === ID)[0];
                console.log(reaction);
                setReactionData(reaction);
                */
                //

                const emotionsResponse = await axios.get(GET_EMOTIONS_API.replace('{id}', reactionId));
                console.log("emotions", emotionsResponse);
                const items = emotionsResponse.data.items.filter((item) => item.reactionId === ID);

                const groupedAndSortedData = groupAndSortEmotionData(items);

                const chartData = createChartConfigs(emotionColor, groupedAndSortedData);
                setLineChartData(chartData);

                setEmotionsData(groupedAndSortedData);

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
                <Grid item lg={8} md={12} sm={12} xs={12}>
                    {lineChartData.map((dataEntry, index) => (
                        <Grid container key={index} alignItems="center" marginBottom={1}>
                            <Grid item lg={2} md={3} sm={3} xs={12}>
                                <Typography variant="subtitle1" marginRight={2}>
                                    {dataEntry.options.tooltip.y.title}
                                </Typography>
                            </Grid>
                            <Grid item lg={10} md={9} sm={9} xs={12}>
                                <Chart {...dataEntry} />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            )}
            {activeButton === 'distribution' && (
                <>
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
