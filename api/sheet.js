import axios from 'axios'

class SheetApi {
  constructor() {
    this.apiBase = 'https://spreadsheets.google.com/feeds/list';
  }
 
  news() {
    return axios.get(`${this.apiBase}/1O5hfDv0hmbMQtq8T4102HPkEUs24NQKp6Ps0Y4IVpHI/od6/public/values?alt=json`)
      .then((res) => {
        const items = []
        const values = Object.values(res.data.feed.entry)
        values.forEach((value) => {
          const item = {
            text: value.gsx$title.$t,
            url: value.gsx$url.$t,
            date: value.gsx$date.$t,
          };
          items.push(item)
        });
        return items;
      })
      .catch(e => ({ error: e }));
  }

  patientsGraph() {
    return axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=lttTvfv73JB1_0b3dWmanW_0P9DGkUcm-AfsaNdLi66LA3jZN-2LxoI61hsD1XcvX7wjJPbA-aQMU8fYuYzu_il2z3j02F4um5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnP9k53dGa_9bOh55uXRyK3KuHQRrFP7y3JXXDLFBzyALBHA50y4X5nQTHbX7VSKaSRdIug5zkO6q&lib=MkDaaQ5v_1yAZBU3X6zh8HTFkUrmYniUZ')
      .then((res) => {
        return res.data.patients_summary;
      })
      .catch(e => ({ error: e }));
  }
}
 
const sheetApi = new SheetApi();
 
export default sheetApi;
