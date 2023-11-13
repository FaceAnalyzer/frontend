import {Grid} from "@mui/material";
import Chart from "react-apexcharts";
import {useTheme} from "@mui/material/styles";
import {dummyBoxPlotData} from "./dummy-chart-data";

// ==============================|| BOX PLOT CHART ||============================== //

const BoxPlotChart = (boxPlotData) => {
    const theme = useTheme();

    const data = [];
    const unmappedData = boxPlotData.boxPlotData;

    Object.entries(unmappedData).forEach(([emotion, values]) => {
        data.push({
            x: emotion,
            y: values.slice().sort((a, b) => a - b)
        });
    });

    const testData = [];
    Object.entries(dummyBoxPlotData).forEach(([emotion, values]) => {
        testData.push({
            x: emotion,
            y: values.slice().sort((a, b) => a - b)
        });
    });
    console.log("testData");
    console.log(testData);
    console.log("data");
    console.log(data);

    const maxY = Math.max(...data.flatMap(({y}) => y));
    console.log(maxY);

    return (
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Chart
                    type="boxPlot"
                    series={[
                        {
                            type: 'boxPlot',
                            data: testData
                        }
                    ]}
                    options={{
                        chart: {
                            type: 'boxPlot',
                            height: 350
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
                                }
                            }
                        },
                        yaxis: {
                            max: 1.0,
                            min: 0.0,
                            decimalsInFloat: 2
                        }
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default BoxPlotChart;