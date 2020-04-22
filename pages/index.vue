<template>
  <div class="MainPage">
    <page-header :icon="headerItem.icon" :title="headerItem.title" :date="headerItem.date" />
    <whats-new :items="newsItems" />
    <static-button :url="'/flow'" :text="'相談の手順を確認する'" />
    <v-row class="DataBlock">
      <v-col cols="12" md="6" class="DataCard">
        <svg-card
          title="検査陽性者の状況"
          :title-id="'details-of-confirmed-cases'"
          :date="confirmed.last_update"
        >
          <pulse-loader v-if="!confirmed.loaded" :loading="!confirmed.loaded" color="#808080" />
          <confirmed-cases-table v-else v-bind="confirmedCases" />
        </svg-card>
      </v-col>
      <v-col cols="12" md="6" class="DataCard">
        <time-bar-chart
          :loaded="patients_summary.loaded"
          title="陽性患者数"
          :title-id="'number-of-confirmed-cases'"
          :chart-id="'time-bar-chart-patients'"
          :chart-data="patientsGraph"
          :date="patients_summary.last_update"
          :unit="$t('人')"
        />
      </v-col>
      <v-col cols="12" md="12" class="DataCard">
        <data-table
          :loaded="patients.loaded"
          :title="'陽性患者の属性'"
          :title-id="'attributes-of-confirmed-cases'"
          :chart-data="patientsTable"
          :chart-option="{}"
          :date="patients.last_update"
          :info="sumInfoOfPatients"
          :sorting="patientsTableSorting"
        />
      </v-col>
      <v-col cols="12" md="12" class="DataCard">
        <multiple-line-chart
          :loaded="goout_comein_summary.loaded"
          title="来訪者・往訪者の推移"
          :title-id="'number-of-goout-comein'"
          :chart-id="'line-chart-goout-comein'"
          :chart-data="goout_comeinGraph"
          :date="goout_comein_summary.last_update"
          :unit="$t('%')"
        />
      </v-col>

    </v-row>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import TimeBarChart from '@/components/TimeBarChart.vue'
import MultipleLineChart from '@/components/MultipleLineChart.vue'
import WhatsNew from '@/components/WhatsNew.vue'
import StaticButton from '@/components/StaticButton.vue'
import DataTable from '@/components/DataTable.vue'
import SvgCard from '@/components/SvgCard.vue'
import ConfirmedCasesTable from '@/components/ConfirmedCasesTable.vue'
import formatGraph from '@/utils/formatGraph'
import formatLineGraph from '@/utils/formatLineGraph'
import formatTable from '@/utils/formatTable'
import formatConfirmedCases from '@/utils/formatConfirmedCases'
import sheetApi from '@/api/sheet'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  components: {
    PageHeader,
    TimeBarChart,
    MultipleLineChart,
    WhatsNew,
    StaticButton,
    DataTable,
    SvgCard,
    ConfirmedCasesTable,
    PulseLoader
  },
  created() {
    this.getNews()
    this.getData()
  },
  methods: {
    async getNews() {
      this.newsItems = await sheetApi.getNewsData()
    },
    async getData() {
      await sheetApi.graphMainSummary().then(response => {
        this.getConfirmedData(response)
        this.headerItem.date = response.last_update
      })
      await sheetApi.getPatientsSummary().then(response => {
        this.getPatientsData(response)
      })
      await sheetApi.getPatients().then(response => {
        this.getPatientsTableData(response)
      })
      await sheetApi.getGoout_Comein().then(response => {
        this.getGooutComeinData(response)
      })
    },
    getPatientsTableData(patients) {
      for (const row of patients.data) {
        row['居住地'] = this.$t(row['居住地'])
        row['年代'] = this.$t(row['年代'])
        row['性別'] = this.$t(row['性別'])
      }

      this.patientsTable = formatTable(patients.data)
      for (const header of this.patientsTable.headers) {
        header.text = this.$t(header.value)
      }
      this.patients.last_update = patients.last_update
      this.patients.loaded = true
      const patientsDate = patients.date
      this.sumInfoOfPatients = {
        lText: patients.data.length,
        sText: this.$t('{patientsDate}の累計', { patientsDate }),
        unit: this.$t('人')
      }
    },
    getPatientsData(patients_summary) {
      this.patientsGraph = formatGraph(patients_summary.data)
      this.patients_summary.last_update = patients_summary.last_update
      this.patients_summary.loaded = true
    },
    getConfirmedData(main_summary) {
      this.confirmedCases = formatConfirmedCases(main_summary.data)
      this.confirmed.last_update = main_summary.last_update
      this.confirmed.loaded = true
    },
    getGooutComeinData(goout_comein_summary) {
      this.goout_comeinGraph = formatLineGraph(goout_comein_summary.data, goout_comein_summary.label)
      this.goout_comein_summary.last_update = goout_comein_summary.last_update
      this.goout_comein_summary.loaded = true
    }
  },
  data() {
    const data = {
      patients: {
        loaded: false,
        last_update: ''
      },
      patients_summary: {
        loaded: false,
        last_update: ''
      },
      confirmed: {
        loaded: false,
        last_update: ''
      },
      goout_comein_summary: {
        loaded: false,
        last_update: ''
      },
      /**
       * 全体の最終更新日
       */
      last_update: '',
      /**
       * 各グラフ系のデータ整理後のデータ
       */
      patientsTable: {},
      patientsGraph: [],
      goout_comeinGraph: {},
      confirmedCases: {},
      sumInfoOfPatients: {},
      headerItem: {
        icon: 'mdi-chart-timeline-variant',
        title: '県内の最新感染動向',
        date: ''
      },
      patientsTableSorting: {
        sortBy: '日付',
        sortDesc: true
      },
      newsItems: []
    }
    return data
  },
  head() {
    return {
      title: '県内の最新感染動向'
    }
  }
}
</script>

<style lang="scss" scoped>
.MainPage {
  .DataBlock {
    margin: 20px -8px;
    .DataCard {
      @include largerThan($medium) {
        padding: 10px;
      }
      @include lessThan($small) {
        padding: 4px 8px;
      }
    }
  }
}
</style>
