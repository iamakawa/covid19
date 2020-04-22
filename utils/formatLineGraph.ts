type subtotalObject = {
  [key: string]: number
}

type DataType = {
  日付: Date
  小計: subtotalObject
}
type LabelType = (string)[]

type DataSetType = {
  label: string
  data: (number)[]
  borderColor: string
  backgroundColor: string
  fill: boolean
}

type LineDataType = {
  labels: (string)[]
  datasets: (DataSetType)[]
}

const lineColors = ['#69b6d5','#9ce8ff','#3386a4','#005975']

export default (data: DataType[], labels_in: LabelType) => {
  const today = new Date()
  const datas: DataSetType[] = []
  const days  = []
  const vals  = new Array(labels_in.length)
  for(var i=0; i<labels_in.length; i++) {
    vals[i] = []
  }

  const currentdata = data
  for(var i=0; i<currentdata.length; i++) {
    const date = new Date(currentdata[i]['日付'])
    days.push((date.getMonth() + 1)+'/'+(date.getDate()))
    for(var j=0; j<labels_in.length; j++) {
      const currentval = currentdata[i]['小計']
      vals[j].push(currentval[labels_in[j]]-100)
    }
  }

  for(var i=0; i<labels_in.length; i++) {
    var dataset: DataSetType = {
      label : labels_in[i],
      data : vals[i],
      borderColor : lineColors[i%4],
      backgroundColor : lineColors[i%4],
      fill: false,
    };
    datas.push(dataset);
  }
  const lineData = {
    labels: days,
    datasets: datas
  }

  return lineData
}
