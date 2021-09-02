/*eslint-disable */
import Loading from '@material-ui/core/CircularProgress'
import React, { useEffect, useState } from "react"
import Table from '../component/Table/'
import NoData from '../component/Table/NoData'
import Toolbar from '../component/Toolbar'
import { isAvailable } from '../data_function'
import '../style/font.css'
import '../style/lineTable.css'

async function getData() {
  // const time = await  v1_getAPI('bus/shuttle/time/', 'result')  // important api sql 구문에서 첫 노선 시간에 따른 정렬 순서대로 불러올것!
  // const line = await  v1_getAPI('bus/shuttle/line/', 'result')
  
  // const timeData = setTime_orderby_ID(time)
  // const lineData = lineToRows(timeData, line)
  
  return { timeData : [], lineData : []}
}

let lineData:Object = {}, 
    timeData:Object = {},
    columns:string[] = []

const ShuttleLine = props => {
  const [state, setState] = useState('apply')
  const [lineName, setLineName] = useState('') 
  const [day, setDay] = useState('')
  const init = () => {
    setLineName('')
    setDay('')
  }
  console.log(timeData)
  //data setting
  useEffect(()=> {
    getData().then(res => {
      ({timeData, lineData} = res)
      const _name = Object.keys(lineData)[0]

      setLineName(_name)
      setDay(Object.keys(lineData[_name])[0])

      setState('show')
    })
  }, [])
  if(state === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>
  
  let selected = !(lineName === '' || day === '')
  if(selected) {
    if(!isAvailable(lineData[lineName]) || !isAvailable(lineData[lineName][day])) {
      init()
      return null
    }
    else columns = ['운행', ...lineData[lineName][day]['LINE'].map(value => value['NAME'])]
  }

  const forms = [
    [{
        name : '노선',
        label : 'Line',
        type : 'select',
        options : Object.keys(lineData).map((value, idx) => ({'value' : value, 'label' : value})),
        onChange : value => {
          setDay(Object.keys(lineData[value])[0])
          setLineName(value)
        },
        value:lineName,
        disable : () => (state !== 'show')
    },
    {
        name : '날짜',
        label : 'Days',
        type : 'select',
        options : (typeof(lineData[lineName]) == 'undefined') ? ['None'] : 
        Object.keys(lineData[lineName]).map((value, idx) => ({'value' : value, 'label' : value})),
        onChange: value => setDay(value),
        value:day,
        disable : () => ((lineName == '') || (state !== 'show'))
    },]
  ]
  
  const displayComponent = () => {
    if(!selected) return <NoData message='Please Select Options'/>

    const now = lineData[lineName][day]
    const record = Object.keys(now).map(key => {
    if(key !== 'LINE')
        return now[key].map(data => data['TIME'].split(':').slice(0, 2).join(':'))
    }); record.pop()
    const rowHead = Array.from({length : Object.keys(now).length-1}, (x, idx) => idx+1)
    
    return (
        <Table
            column = {columns}
            rowHead = {rowHead}
            record = {record}
            editable={state === 'update-time'}
            headWidth={5}
        />)
  }
  
  return (
    <div>
      <Toolbar 
      title = '셔틀버스 시간표' 
      inputForm = {forms}
      buttons={[]}/>
      {displayComponent()}
    </div>
  )
}

export default ShuttleLine;
