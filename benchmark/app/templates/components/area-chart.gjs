import Component from '@glimmer/component';

import Chart from 'chart.js/auto';
import { modifier } from 'ember-modifier';

import { formatNumber, getAltName } from './utils';

export default class AreaChart extends Component {
  limit = 8;
  total = 0;
  options = null;

  renderChart = modifier((element) => {
    this._renderChart(element?.querySelector('.chart-canvas'));

    return () => {
      this._chart?.destroy();
    };
  });

  _chart = null;

  _renderChart(canvasElement) {
    if (!canvasElement) {
      return;
    }

    const context = canvasElement.getContext('2d');
    const chartData = this.args.data;

    const [axis, ...datasets] = chartData;

    const labels = datasets.map(({ emberVersion, altName }) => {
      return emberVersion + getAltName(altName);
    });

    const data = {
      labels,
      datasets: [
        {
          label: 'Mean',
          data: datasets.map((v) => {
            return v.mean;
          }),
          backgroundColor: 'transparent',
          borderColor: 'steelblue',
          pointRadius: 2,
          pointBackgroundColor: 'steelblue',
          pointBorderColor: 'steelblue',
          borderWidth: 5,
        },
        {
          data: datasets.map((v) => v.margin_error_lower),
          backgroundColor: 'rgb(0, 0, 0, 0.1)',
          borderColor: 'transparent',
          fill: 0,
          pointRadius: 0,
          borderWidth: 0,
        },
        {
          data: datasets.map((v) => v.margin_error_upper),
          backgroundColor: 'rgb(0, 0, 0, 0.1)',
          borderColor: 'transparent',
          fill: 0,
          pointRadius: 0,
          borderWidth: 0,
        },
      ],
    };

    if (!canvasElement) {
      return;
    }

    this._chart?.destroy();
    this._chart = new Chart(context, this.buildChartConfig(data, { axis }));
  }

  buildChartConfig(data, { axis } = {}) {
    return {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 50,
        scales: {
          x: {
            type: 'category',
            title: {
              display: axis?.[0],
              text: axis?.[0],
            },
            grid: {
              drawOnChartArea: false,
              drawTicks: true,
            },
          },
          y: {
            type: 'linear',
            grace: 0,
            title: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                return formatNumber(value);
              },
            },
          },
        },
        plugins: {
          title: {
            display: axis?.[1],
            align: 'start',
            text: axis?.[1],
          },
          legend: {
            display: false,
          },
          filler: {
            propagate: false,
          },
          tooltip: {
            displayColors: false,
            filter: (context) => {
              return context.datasetIndex === 0;
            },
            callbacks: {
              label: (context) => `${formatNumber(context.parsed.y)}ms`,
            },
          },
        },
        pointBackgroundColor: '#fff',
        radius: 10,
        interaction: {
          mode: 'index',
          intersect: false,
        },
      },
    };
  }

  <template>
    <div class="chart-canvas-container" {{this.renderChart}}>
      <canvas class="chart-canvas"></canvas>
    </div>
  </template>
}
