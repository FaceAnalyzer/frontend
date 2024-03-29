import {Grid} from "@mui/material";
import Chart from "react-apexcharts";
import {useTheme} from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import PropTypes from "prop-types";

// ==============================|| BOX PLOT CHART ||============================== //

const BoxPlotChart = ({isLoading, boxPlotData}) => {
    const theme = useTheme();

    const calculateMedian = (arr) => {
        const middle = Math.floor(arr.length / 2);
        //If the array is of an even length, return the average of the two middle values
        if(arr.length % 2 === 0){
            return (arr[middle - 1] + arr[middle]) / 2;
        }
        //Else return the middle value
        else{
            return arr[middle];
        }
    }

    const calculateBoxPlotData = (data) => {
        const roundingDecimals = 6;
        const sortedData = data.slice().sort((a, b) => a - b);

        const median = calculateMedian(sortedData).toFixed(roundingDecimals);
        const q1 = calculateMedian(sortedData.slice(0, Math.floor(sortedData.length / 2))).toFixed(roundingDecimals);
        const q3 = calculateMedian(sortedData.slice(Math.ceil(sortedData.length / 2))).toFixed(roundingDecimals);

        const min = sortedData[0].toFixed(roundingDecimals);
        const max = sortedData[sortedData.length - 1].toFixed(roundingDecimals);

        return [min, q1, median, q3, max];
    };

    const testBoxData = [];
    const rawData = boxPlotData;
    for(let key in rawData){
        const emotionData = []
        rawData[key].forEach((entry) => {
            emotionData.push(entry["value"]);
        })

        testBoxData.push({x: key, y: calculateBoxPlotData(emotionData)});
    }
    console.log("tbd", testBoxData);

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                {isLoading ? (
                    <Skeleton animation={"wave"}>
                        <Chart
                            type="boxPlot"
                            height={"500vh"}
                        />
                    </Skeleton>
                    ):(
                    <Chart
                        type="boxPlot"
                        height={"500vh"}
                        series={[
                            {
                                type: 'boxPlot',
                                data: testBoxData
                            }
                        ]}
                        options={{
                            chart: {
                                id: "emotions-distribution",
                                type: 'boxPlot',
                                height: 350,
                                toolbar: {
                                    show: false
                                }
                            },
                            title: {
                                text: 'Emotions Distribution',
                                align: 'left'
                            },
                            plotOptions: {
                                boxPlot: {
                                    colors: {
                                        upper: theme.palette.primary[800],
                                        lower: theme.palette.primary[200]
                                    },
                                }
                            },
                            yaxis: {
                                max: 1.0,
                                min: 0.0,
                                decimalsInFloat: 2
                            }
                        }}
                    />
                )}
            </Grid>
        </Grid>
    );
};

BoxPlotChart.propTypes = {
    isLoading: PropTypes.bool,
    boxPlotData: PropTypes.object,
}

export default BoxPlotChart;