import axios from 'axios'
import dayjs from 'dayjs'

class SheetApi {
  constructor() {
    this.apiBase = 'https://spreadsheets.google.com/feeds/list';
    this.macroApiBase = 'https://script.googleusercontent.com/macros/echo';
    this.jsonApiBase = 'https://code-for-gifu.github.io/covid19-scraping'
  }

  getNewsData() {
    return axios.get(`${this.apiBase}/15CHGPTLs5aqHXq38S1RbrcTtaaOWDDosfLqvey7nh8k/1/public/values?alt=json`)
      .then((res) => {
        let num = 2
        const items = []
        const values = Object.values(res.data.feed.entry)
        for (let i = 0; i < num; i++) {
          const item = {
            text: values[i].gsx$title.$t,
            url: values[i].gsx$url.$t,
            date: values[i].gsx$date.$t,
          };
          items.push(item)
        }
        return items;
      })
      .catch(e => ({ error: e }));
  }

  graphMainSummary(inspections_sum) {
    return axios.get(`${this.jsonApiBase}/patients.json`)
      .then((res) => {
        const items = { '検査実施件数': inspections_sum, '陽性患者数': 0, '入院中': 0, '軽症・中等症': 0, '重症': 0, '退院': 0, '死亡': 0 }
        const values = Object.values(res.data.data)
        values.forEach((value) => {
          if (value.退院済フラグ == '1') {
            if (value.患者状態 == '死亡') {
              items['死亡']++;
            }
            else {
              items['退院']++;
            }
          }
          else {
            if (value.患者状態 == '重症') {
              items['重症']++;
            }
            else {
              items['軽症・中等症']++;
            }
          }
        });
        items['入院中'] = items['軽症・中等症'] + items['重症'];
        items['陽性患者数'] = items['入院中'] + items['退院'] + items['死亡'];

        const main_summary = {
          data: {
            attr: '検査実施件数',
            value: items['検査実施件数'],
            children: [
              {
                attr: '陽性患者数',
                value: items['陽性患者数'],
                children: [
                  {
                    attr: '入院中',
                    value: items['入院中'],
                    children: [
                      {
                        attr: '軽症・中等症',
                        value: items['軽症・中等症'],
                      },
                      {
                        attr: '重症',
                        value: items['重症'],
                      }
                    ]
                  },
                  {
                    attr: '退院',
                    value: items['退院'],
                  },
                  {
                    attr: '死亡',
                    value: items['死亡'],
                  }
                ]
              }
            ]
          },
          last_update: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm'),
        }
        return main_summary;
      })
      .catch(e => ({ error: e }));
  }

  getPatients() {
    return axios.get(`${this.jsonApiBase}/patients.json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.data)
        values.forEach((value) => {
          const item = {
            No: value.No,
            リリース日: dayjs(value.公表年月日, 'YYYY-MM-DD').format() ?? '不明',
            // 曜日: value.gsx$曜日.$t,
            居住地: value.患者居住地,
            年代: value.患者年代,
            性別: value.患者性別,
            備考: value.備考,
            退院: value.退院済フラグ,
          }
          items.push(item)
        });
        const patients = {
          data: items,
          last_update: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm'),
          date: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm')
        }
        return patients;
      })
      .catch(e => ({ error: e }));
  }

  getPatientsSummary() {
    return axios.get(`${this.jsonApiBase}/patients.json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.data)
        values.forEach((value) => {
          const item = {
            日付: dayjs(value.公表年月日, 'YYYY-MM-DD').format() ?? '不明'
          }
          items.push(item)
        });

        // 日付ごとに集計
        const group = items.reduce((result, current) => {
          const element = result.find((p) => p.日付 === current.日付);
          if (element) {
            element.小計++;
          } else {
            result.push({
              日付: current.日付,
              小計: 1,
            });
          }
          return result;
        }, []);
        const patients_summary = {
          data: this.addPaddingDay2Summary(group),
          last_update: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm'),
        }
        return patients_summary;
      })
      .catch(e => ({ error: e }));
  }

  addPaddingDay2Summary(summary_data) {
    var items = [];
    var pos = 0;
    var day_diff = dayjs(summary_data[summary_data.length - 1]['日付']).diff(summary_data[0]['日付'], 'days', false);

    for (var i = 0; i <= day_diff; i++) {
      var current_day = dayjs(summary_data[0]['日付'], 'YYYY-MM-DD').add(i, 'days');
      const item_padding = {
        日付: current_day,
        小計: 0,
      };

      if (pos >= summary_data.length) {
        items.push(item_padding)
        continue;
      }

      if (dayjs(summary_data[pos]['日付']).isSame(current_day)) {
        items.push(summary_data[pos]);
        pos++;
      }
      else {
        items.push(item_padding)
      }
    }
    return items;
  }

  getInspectionsSummary() {
    return axios.get(`${this.jsonApiBase}/testcount.json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.data)
        values.forEach((value) => {
          const item = {
            日付: dayjs(value.実施年月日, 'YYYY-MM-DD').format() ?? '不明',
            小計: Number(value.検査実施件数),
          }
          items.push(item)
        });
        const inspections_summary = {
          data: items,
          last_update: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm'),
        }
        return inspections_summary;
      })
      .catch(e => ({ error: e }));
  }

  getCallCenterSummary() {
    return axios.get(`${this.jsonApiBase}/callcenter.json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.data)
        values.forEach((value) => {
          const item = {
            日付: dayjs(value.受付年月日, 'YYYY/MM/DD').format() ?? '不明',
            小計: Number(value.相談件数),
          }
          items.push(item)
        });
        const callcenter_summary = {
          data: items,
          last_update: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm'),
        }
        return callcenter_summary;
      })
      .catch(e => ({ error: e }));
  }

  getAdviceCenterSummary() {
    return axios.get(`${this.jsonApiBase}/advicecenter.json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.data)
        values.forEach((value) => {
          const item = {
            日付: dayjs(value.受付年月日, 'YYYY/MM/DD').format() ?? '不明',
            小計: Number(value.帰国者接触者相談センター相談件数),
          }
          items.push(item)
        });
        const advicecenter_summary = {
          data: items,
          last_update: dayjs(res.data.last_update).format('YYYY/MM/DD HH:mm'),
        }
        return advicecenter_summary;
      })
      .catch(e => ({ error: e }));
  }


  getMunicipalityLink() {
    return axios.get(`${this.apiBase}/1Dm9dsei-QXmilRN9V7IVmgnZuC8aRsFQE5RPR0-L7bI/1/public/values?alt=json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.feed.entry)
        values.forEach((value) => {
          const item = {
            自治体名: value.gsx$自治体名.$t,
            庁舎所在地: value.gsx$庁舎所在地.$t,
            ふりがな: value.gsx$ふりがな.$t,
            対策ページ名称: value.gsx$対策ページ名称.$t,
            リンク: value.gsx$リンク.$t,
            電話番号: value.gsx$電話番号.$t
          }
          items.push(item)
        });
        const links = {
          data: items
        }
        return links;
      })
      .catch(e => ({ error: e }));
  }

  /**
   * 岐阜県相談窓口一覧情報の取得
   */
  getConsultations() {
    return axios.get(`${this.apiBase}/10b0NTVctq3jjSvaA6-Vc-dQJYt5FFEP292MLzkCdazs/1/public/values?alt=json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.feed.entry)
        values.forEach((value) => {
          const item = {
            consultation: value.gsx$consultation.$t,
            name: value.gsx$name.$t,
            tel1: value.gsx$tel1.$t,
            tel2: value.gsx$tel2.$t,
            ontime: value.gsx$ontime.$t,
            addr: value.gsx$addr.$t,
            locname: value.gsx$locname.$t,
            lon: value.gsx$lon.$t,
            lat: value.gsx$lat.$t,
            classification: value.gsx$classification.$t,
            color: value.gsx$color.$t
          }
          items.push(item)
        });
        const links = {
          data: items
        }
        return links;
      })
      .catch(e => ({ error: e }));
  }

  graphData() {
    return axios.get(`${this.macroApiBase}?user_content_key=lttTvfv73JB1_0b3dWmanW_0P9DGkUcm-AfsaNdLi66LA3jZN-2LxoI61hsD1XcvX7wjJPbA-aQMU8fYuYzu_il2z3j02F4um5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnP9k53dGa_9bOh55uXRyK3KuHQRrFP7y3JXXDLFBzyALBHA50y4X5nQTHbX7VSKaSRdIug5zkO6q&lib=MkDaaQ5v_1yAZBU3X6zh8HTFkUrmYniUZ`)
      .then((res) => {
        return res.data;
      })
      .catch(e => ({ error: e }));
  }
}

const sheetApi = new SheetApi();

export default sheetApi;
