<template>
  <data-view :title="title" :date="date" :url="url">
    <pulse-loader v-if="!loaded" :loading="!loaded" color="#808080" />
    <multiplelinechart
      v-else
      :chart-data="displayData"
      :options="displayOption"
      :height="240"
    />
   <p class="Graph-Desc">{{info}}</p>
  </data-view>
</template>

<style lang="scss" scoped>
  .Graph-Desc {
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 0;
    font-size: 12px;
    color: $gray-3;
}
</style>

<script>
import DataView from '@/components/DataView.vue'
import DataViewBasicInfoPanel from '@/components/DataViewBasicInfoPanel.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  components: { DataView, DataViewBasicInfoPanel, PulseLoader },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    chartData: {
      type: Object,
      default: () => []
    },
    date: {
      type: String,
      required: true,
      default: ''
    },
    unit: {
      type: String,
      required: false,
      default: ''
    },
    url: {
      type: String,
      required: false,
      default: ''
    },
    info: {
      type: String,
      required: false,
      default: ''
    },
    loaded: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    displayData() {
      return {
        labels: this.chartData.labels,
        datasets: this.chartData.datasets
      }
    },
    displayOption() {
      const unit = this.unit
      return {
        tooltips: {
          displayColors: false,
          callbacks: {
            label(tooltipItem) {
              const labelText = tooltipItem.value + ' ' + unit
              return labelText
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 10,
                maxTicksLimit: 20,
                fontColor: '#808080'
              }
            }
          ],
          yAxes: [
            {
              location: 'bottom',
              stacked: true,
              gridLines: {
                display: true,
                color: '#E5E5E5'
              },
              ticks: {
                suggestedMin: 0,
                maxTicksLimit: 8,
                fontColor: '#808080'
              }
            }
          ]
        }
      }
    }
  },
}
</script>
