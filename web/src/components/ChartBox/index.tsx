import React, { useEffect, useState } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import '../../../node_modules/highcharts/css/highcharts.css'

const defaultChartOptions = {
    chart: {
        type: 'line',
        height: '560px',
        styledMode: true,
        // plotBorderWidth: null,
        plotShadow: false,
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true
            },
            showInLegend: true,
        },
        series: {
            marker: {
                symbol: 'circle',
                radius: 4.5,
            }
        }
    },
    credits: { enabled: false },
    title: { text: null },
    xAxis: {
        crosshair: {
            width: 0,
        },
        gridLineWidth: 1,
        title: null,
        labels: {
            align: 'left',
            rotation: 0,
            x: 0,
            y: 22,
        }
    },
    yAxis: {
        gridLineWidth: 0,
        title: null,
    },
}


const ChartBox = ({ series }: any) => {
    let options = Highcharts.merge(defaultChartOptions, series)

    return (
        <>
            <HighchartsReact
                containerProps={{ style: { height: "100%", backgroundColor: "blue" } }}
                highcharts={Highcharts}
                options={options} />
        </>
    )
}

export default ChartBox