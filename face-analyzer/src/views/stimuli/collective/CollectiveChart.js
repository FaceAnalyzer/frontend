import React, {useEffect, useState} from "react";
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import {Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, Area, ComposedChart} from "recharts";
import {addMilliseconds, format} from "date-fns";
import {mean, standardDeviation} from "simple-statistics";
import {curveCardinal} from "d3-shape";
import PropTypes from "prop-types";

const CollectiveChart = ({ groupedSortedData }) => {
    const [chartData, setChartData] = useState([]);
    const [selectedLines, setSelectedLines] = useState(() =>
        Object.keys(groupedSortedData).reduce((acc, emotion) => {
            acc[emotion] = true; // Initially, all lines are selected
            return acc;
        }, {})
    );

    const emotionColor = {
        Anger: "#ff0000",
        Disgust: "#00a0a0",
        Fear: "#800080",
        Happiness: "#ffcc00",
        Sadness: "#3399ff",
        Surprise: "#cc66ff",
        Neutral: "#000",
    };

    const formatMilliseconds = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const createChartData = (groupedData) => {
        const data = Object.keys(groupedData[Object.keys(groupedData)[0]]).map(
            (dataPointIndex) => {
                const timeOffset =
                    groupedData[Object.keys(groupedData)[0]][dataPointIndex]["timeOffset"];
                return {
                    timeOffset,
                    ...Object.keys(groupedData).reduce((acc, emotion) => {
                        acc[emotion] = groupedData[emotion][dataPointIndex].value;
                        return acc;
                    }, {}),
                };
            }
        );
        return data;
    };

    const bucketData = (data, bucketSize) => {
        const buckets = {};
        data.forEach((entry) => {
            const bucketIndex = Math.floor(entry.timeOffset / bucketSize);
            const bucketKey = bucketIndex*100;
            if (!buckets[bucketKey]) {
                buckets[bucketKey] = [];
            }
            buckets[bucketKey].push(entry);
        });
        return buckets;
    };

    useEffect(() => {
        if (groupedSortedData.length !== 0) {
            const tmpChartData = createChartData(groupedSortedData);
            setChartData(tmpChartData);

            const bucketedData = bucketData(tmpChartData, 100);

            const processedData = Object.keys(bucketedData).map((bucketKey) => {
                const bucketValues = bucketedData[bucketKey].map((entry) =>
                    Object.keys(groupedSortedData).map((emotion) => entry[emotion])
                );

                const bucketAverages = Object.keys(groupedSortedData).reduce(
                    (acc, emotion, index) => {
                        acc[emotion] = mean(bucketValues.map((v) => v[index]));
                        return acc;
                    },
                    {}
                );

                const bucketStdDeviations = Object.keys(groupedSortedData).reduce(
                    (acc, emotion, index) => {
                        acc[emotion] = standardDeviation(
                            bucketValues.map((v) => v[index])
                        );
                        return acc;
                    },
                    {}
                );

                const result = {};

                result["bucketKey"] = bucketKey;

                //Clamp the values to the interval [0,1]
                for(const emotion in bucketAverages){
                    const stdDevMin = bucketAverages[emotion] - bucketStdDeviations[emotion];
                    const stdDevMax = bucketAverages[emotion] + bucketStdDeviations[emotion];

                    result[`Average${emotion}`] = bucketAverages[emotion];
                    result[`stdDevRange${emotion}`] = [
                        stdDevMin < 0 ? 0 : stdDevMin,
                        stdDevMax > 1 ? 0 : stdDevMax
                    ]
                }

                return result;
            });

            setChartData(processedData);

            setSelectedLines((prevSelectedLines) => {
                const emotionsFromData = Object.keys(groupedSortedData);
                const updatedSelectedLines = {};

                emotionsFromData.forEach((emotion) => {
                    updatedSelectedLines[emotion] = prevSelectedLines[emotion] ?? true;
                });

                return updatedSelectedLines;
            });

        }
    }, [groupedSortedData]);

    const timeFormat = "mm:ss";

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const formattedTime = format(addMilliseconds(new Date(0), label), timeFormat)
            return (
                <div style={tooltipStyle}>
                    <p style={{color: '#fff'}}>{`Time (mm:ss): ${formattedTime}`}</p>
                    {payload.map(
                        (entry) =>{
                            return entry.dataKey.startsWith("std") ? (
                                <p key={`emotion-${entry.dataKey}`} style={{ color: entry.color, margin: 0 }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "10px", // Adjust the width of the colored box or circle
                                            height: "10px", // Adjust the height of the colored box or circle
                                            borderRadius: "50%",
                                            backgroundColor: entry.color,
                                            marginRight: "5px", // Adjust the spacing between the box and text
                                        }}
                                    />
                                    <span style={{color: '#fff'}}>
                                        {`${entry.dataKey.replace("stdDevRange", "")} stddev: [${entry.value[0].toFixed(4)}, ${entry.value[1].toFixed(4)}]`}
                                    </span>
                                </p>
                            ) : (
                                <p key={`emotion-${entry.dataKey}`} style={{ color: entry.color, margin: 0 }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "10px", // Adjust the width of the colored box or circle
                                            height: "10px", // Adjust the height of the colored box or circle
                                            borderRadius: "50%",
                                            backgroundColor: entry.color,
                                            marginRight: "5px", // Adjust the spacing between the box and text
                                        }}
                                    />
                                    <span style={{color: '#fff'}}>
                                        {`${entry.dataKey.replace("Average", "")}: ${entry.value.toFixed(4)}`}
                                    </span>
                                </p>
                            )}
                    )}
                </div>
            );
        }

        return null;
    };

    const handleLineToggle = (emotion) => {
        setSelectedLines((prevSelectedLines) => ({
            ...prevSelectedLines,
            [emotion]: !prevSelectedLines[emotion],
        }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ResponsiveContainer  height={600} key={"responsiveContainer"}>
                    <ComposedChart
                        key={"composedChart"}
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                    >
                        <XAxis
                            dataKey="bucketKey"
                            type="number"
                            domain={[
                                Math.min(...chartData.map((entry) => entry.bucketKey)),
                                Math.max(...chartData.map((entry) => entry.bucketKey)),
                            ]}
                            tickFormatter={formatMilliseconds}
                            ticks={chartData.map((entry) => entry.bucketKey)}
                            label={{value: "Video time (mm:ss)", position: "bottom", offset: 25}}
                        />
                        <YAxis
                            type="number"
                            domain={[0.0, 1.0]}
                            label={{ value: "Emotion level", angle: -90, position: "left" }}
                            tickFormatter={(num) => num.toFixed(4)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Object.keys(groupedSortedData).map((emotion) => (
                            selectedLines[emotion] && (
                                <React.Fragment key={emotion + "-fragment"}>
                                    <Area
                                        key={`${emotion}-area`}
                                        name={`${emotion} stddev`}
                                        type={curveCardinal}
                                        dataKey={`stdDevRange${emotion}`}
                                        stroke="none"
                                        fill={emotionColor[emotion]}
                                        fillOpacity={0.2}
                                        legendType={"none"}
                                    />
                                    <Line
                                        key={emotion}
                                        type={curveCardinal}
                                        name={`${emotion}`}
                                        dataKey={`Average${emotion}`}
                                        stroke={emotionColor[emotion]}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </React.Fragment>
                            )
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {Object.keys(groupedSortedData).map((emotion) => (
                        <FormControlLabel
                            key={emotion}
                            control={
                                <Checkbox
                                    defaultChecked={true}
                                    onChange={() => handleLineToggle(emotion)}
                                    style={{ color: emotionColor[emotion] }}
                                />
                            }
                            label={emotion}
                        />
                    ))}
                </div>
            </Grid>
        </Grid>
    );
};

const tooltipStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "1px solid #ccc",
    padding: "0px 10px 10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

CollectiveChart.propTypes = {
    groupedSortedData: PropTypes.array,
    active: PropTypes.bool,
    payload: PropTypes.object,
    label: PropTypes.string
}

export default CollectiveChart;
