﻿window.blazor_apexchart = {
    charts: [],

    getYAxisLabel(value, index, w) {
         
        if (window.wasmBinaryFile === undefined) {
            console.warn("YAxis labels is only supported in Blazor WASM");
            return value;
        }

        if (w !== undefined) {
            return w.config.dotNetObject.invokeMethod('GetFormattedYAxisValue', value);
        };

        if (index !== undefined) {
            return index.w.config.dotNetObject.invokeMethod('GetFormattedYAxisValue', value);
        }

        return value;
    },

    destroyChart(chartId) {
        var chartFind = this.charts.filter(x => x.opts.chart.chartId === chartId)
        if (chartFind.length > 0) {
            var chart = chartFind[0];
            chart.destroy();
            this.charts = this.charts.filter(x => x.opts.chart.chartId !== chartId);
        }
    },

    renderChart(dotNetObject, container, options) {

        if (options.debug == true) {
            console.log(options);
        }

        var options = JSON.parse(options, (key, value) =>
            (key === 'formatter' || key === 'custom') && value.length !== 0 ? eval("(" + value + ")") : value
        );

        if (options.debug == true) {
            console.log(options);
        }

    
        options.dotNetObject = dotNetObject;

        

        if (options.seriesNonXAxis != undefined) {

            options.series = options.seriesNonXAxis;
        }

        options.chart.events = {
            dataPointSelection: (event, chartContext, config) => {

                var selection = {
                    dataPointIndex: config.dataPointIndex,
                    seriesIndex: config.seriesIndex,
                    selectedDataPoints: config.selectedDataPoints
                }

                dotNetObject.invokeMethodAsync('DataPointSelected', selection);
            }
        }

        //Always destry chart
        this.destroyChart(options.chart.chartId);

        chart = new ApexCharts(container, options);
        this.charts.push(chart)
        chart.render();
        if (options.debug == true) {
            console.log('Chart ' + options.chart.chartId + ' rendered');
        }
    }
}