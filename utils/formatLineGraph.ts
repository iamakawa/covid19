type DataType = {
  日付: Date
  小計: []
}
type LabelType = (string)[]

type DataSetType = {
  label: string
  data: (number)[]
  lineColorID: number
}

type LineDataType = {
  labels: (string)[]
  datasets: (DataSetType)[]
}


export default (data: DataType[], labels_in: LabelType) => {
  const today = new Date()
  const datas: DataSetType[] = []
  const days  = []
  const vals  = new Array(labels_in.length)
  for(var i=0; i<labels_in.length; i++) {
    vals[i] = []
  }

  const currentdata = data//.filter(d => new Date(d['日付']) < today)
  for(var i=0; i<currentdata.length; i++) {
    const date = new Date(currentdata[i]['日付'])
    days.push((date.getMonth() + 1)+'/'+(date.getDate()))
    for(var j=0; j<labels_in.length; j++) {
      const currentval = currentdata[i]['小計']
      vals[j].push(currentval[labels_in[j]])
    }
  }

  for(var i=0; i<labels_in.length; i++) {
    var dataset: DataSetType = {
      label : labels_in[i],
      data : vals[i],
      lineColorID : i%4
    };
    datas.push(dataset);
  }
  const lineData = {
    labels: days,
    datasets: datas
  }

  return lineData
}
