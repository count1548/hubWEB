/*eslint-disable */
import Button from '@material-ui/core/Button'
import Loading from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useMemo, useState } from "react"
import Dialog from '../../component/Dialog'
import Warning from '../../component/Dialog/Warning'
import Table from '../../component/Table/'
import Toolbar from '../../component/Toolbar'
import AutoGenerationBox from '../../component/Toolbar/AutoGenerationBox'
import { getAPI, isAvailable, setAPI } from '../../data_function'
import '../../style/font.css'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table : {
        width : '30%',
        float : 'left'
    },  configBox : {
        width : 'calc(70% - 10px)',
        paddingLeft:'10px',
        float: 'right' as const
    }, button : {
        display:'block',
        padding : '10',
        margin : '10px auto'
    }, mainContent : {
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both'
        }
    }, pageTitle : {
        color : '#2c537a',
        width : '100%',
        height : '32px',
        position : 'relative',
        fontSize : '24px',
        textAlign : 'center',
        fontFamily : 'NanumSquareRoundEB',
        fontWeight : 'bold',
        marginBottom : '20px',
    }
  }),
)
interface lineInterface {
    ROUTE_ID : number,
    DIRECTION : string, ROUTE : Object,
    PRICE :number, C_PRICE: number,
    BOUND : number,
}

async function getData() {  //API 호출 부분 / 개발 후 변경
    let line = await getAPI('bus/line/')
    let station = await getAPI('bus/all/')
    if(!isAvailable(line)) line = []
    if(!isAvailable(station)) station = []
    return {
      linesData : line.map(data => ({
          ...data,
          ROUTE : data['ROUTE']['data'].map((route_data, idx) => ({
            data : data['ROUTE']['data'][idx],
            time : data['ROUTE']['time'][idx]
          }))
      })),
      stationsData : station
    }
}
let linesData:any[] = [], stationsData:any[] = []
const defaultValue:lineInterface = {
    ROUTE_ID : -1,
    DIRECTION : '', ROUTE : {
      data : [],
      time : []
    },
    PRICE : 0, C_PRICE: 0,
    BOUND : 0,
}

const BusLine = props => {
    const [updated, setUpdated] = useState(true)
    const [stat, setState] = useState('apply')
    const [selected, setSelected] = useState(-1)
    const [required, setRequired] = useState(false)
    const [lineData, setLine] = useState<lineInterface>({...defaultValue})
    const [messageOpen, setMessageOpen] = useState(false)

    const classes = useStyles()
    const init = () => {
        setLine({...defaultValue})
        setState('create')
        setSelected(-1)
    }, 
    createButton = {label : '생성하기', action : () => init()}, 
    deleteButton = {label : '삭제하기', action : () => {
        if(selected === -1) return
        setState('apply')
        setAPI('bus/line/delete', {
            ROUTE_ID : linesData[selected]['ROUTE_ID']
        }).then(res => setUpdated(!updated))
    }}

    //setting table head data
    useEffect(()=> {
        getData().then(res => {
            ({linesData, stationsData} = res)
            init()
            setState('create')
        })
    }, [updated]) //생성 -> 생성 / 삭제 / submit
    const routeList = useMemo(() => (selected === -1 ? [] : linesData[selected]['ROUTE']), [selected, stat])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

    const rows = linesData.map(value => [value['DIRECTION']])
    
    const form = [
        [   //Basic Information
            {
                label : '노선이름',
                type : 'text',
                onChange : value => setLine({...lineData, DIRECTION : value}) ,
                value : lineData['DIRECTION'],
            },
            {
              label : '등하교',
              type : 'select',
              options : [
                {label : '등교', value : 0},
                {label : '하교', value : 1}
              ],
              onChange : value => setLine({...lineData, BOUND : value}) ,
              value : lineData['BOUND'],
          },
        ], [   //Selected Information
          {
              label : '아캠가격',
              type : 'text',
              textType : 'money',
              onChange : value => setLine({...lineData, PRICE : value}) ,
              value : lineData['PRICE'],
          }, {
            label : '천캠가격',
            type : 'text',
            textType : 'money',
            onChange : value => setLine({...lineData, C_PRICE : value}) ,
            value : lineData['C_PRICE'],
          },
        ]
    ]

    const buttonClick = () => {
        lineData['ROUTE']['data'].pop(); lineData['ROUTE']['time'].pop();

        if(!isAvailData(lineData)) {
            setMessageOpen(true)
            return;
        }

        setState('apply')
        setAPI(`bus/line/${stat}`, {
            ...lineData,
        }).then(res => setUpdated(!updated))
    }

    const isAvailData = data => {
        return !(
            data['DIRECTION'] === '' ||
            typeof data['ROUTE']['data'] === 'undefined' ||
            typeof data['ROUTE']['time'] === 'undefined' ||
            data['ROUTE']['data'].length < 2
        )
    }

    const rowClick = idx => {
        setLine({...linesData[idx],
            ROUTE: {
                data: linesData[idx]['ROUTE'].map(data => data['data']),
                time: linesData[idx]['ROUTE'].map(data => data['time'])
            }
        })
        setState('update')
        setSelected(idx)
    }

    return (
        <div className='main-warp'>
            <Dialog
                children={'필수 항목을 입력하십시오'}
                onClose = {()=>setRequired(false)}
                defaultState={required}
            />
            <div className={classes.mainContent}>
                <div className={classes.table}>
                    <Table
                        column = {['노선']}
                        isrowHead={false}
                        record = {rows}
                        headWidth={50}
                        onClick={rowClick}
                        maxHeight={735}
                        selectable={true}
                        selecteCount={1}
                        doubleClick={false}
                        updated={stat === 'apply'}
                        defaultSelected={selected}
                        style={{ selectedRowCell : { backgroundColor:'#777' } }}
                    />
                </div>
                
                <div className={classes.configBox}>
                    <Toolbar
                        title='노선 관리'
                        inputForm={form} 
                        buttons={[createButton, deleteButton]}
                    ></Toolbar>
                    <AutoGenerationBox  //마지막 첫번째 수정 못하게
                      dataList={routeList}  //
                      onChange={dataList => {
                        setLine({
                            ...lineData,
                            ROUTE : {
                              "data" : dataList.map(value => value['data']),
                              "time" : dataList.map(value => value['time'])
                            }
                          })
                      }}
                      defaultData = {{ "data" : null, "time" : 0 }}
                      form = {[
                        {label : 'data', type : 'select', width : 300, options : stationsData.map(data => ({
                          label : data['STATION_NAME'],
                          value : data['STATION_ID']
                        })).concat({
                            label : 'None',
                            value : null
                        })},
                        {label : 'time', width: 100, type : 'number', disable : (idx) => {
                            return (idx === 0 || idx === (lineData['ROUTE']['data'].length - 1))
                        }},
                      ]}
                    />
                </div>
            </div>
            <Button 
                variant="contained" 
                color='primary' 
                onClick={buttonClick}
                className={classes.button}>submit</Button>
            <Warning onClose={() => setMessageOpen(false)} title={'경고'} open={messageOpen}>필수항목을 입력하지 않았습니다.</Warning>
        </div>
    )
}
export default BusLine