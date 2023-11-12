const generateRandomData = () => {
    return Array.from({length: 8}, () => Math.random());
};

const generateBoxPlotData = (emotions) => {
    const boxPlotData = {};
    Object.keys(emotions).forEach((emotion) => {
        boxPlotData[emotion] = generateRandomData();
    });
    return boxPlotData;
};

const emotions = {
    'Anger': '#ff0000',
    'Disgust': '#ffa500',
    'Fear': '#800080',
    'Happiness': '#00ff00',
    'Sadness': '#0000ff',
    'Surprise': '#ffff00',
    'Neutral': '#000'
};

export const dummyData = Object.keys(emotions).map((emotion) => {
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
            colors: [emotions[emotion]],
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
            data: generateRandomData()
        }]
    };
});
export const boxPlotData = generateBoxPlotData(emotions);

