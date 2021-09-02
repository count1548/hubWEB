/*eslint-disable */
import Loading from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from "react"
import Dialog from '../component/Dialog'
import Warning from '../component/Dialog/Warning'
import GoogleMap from '../component/Map/'
import Table from '../component/Table/'
import NoData from '../component/Table/NoData'
import Toolbar from '../component/Toolbar'
import { getAPI } from '../data_function'


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
    BUS_ID : number,
    DATE : string,
    IS_SHUTTLE : number,
}

async function getData() {
    const busData = await getAPI('check/device/')
    //if(!isAvailable(line) || !isAvailable(station)) return {linesData : [], stationsData : []}

    return {
        busData
    }
}
let busData:any[2][] = [[], []]

const defaultLocation = {
    lat: 36.734944,
    lng: 127.07475
}
const defaultValue:lineInterface = {
    BUS_ID : 0,
    DATE : Date(),
    IS_SHUTTLE : 0,
}

const BusLine = props => {
    const [stat, setState] = useState('apply')
    const [selected, setSelected] = useState(-1)
    const [required, setRequired] = useState(false)
    const [logFilter, setFilter] = useState<lineInterface>({...defaultValue})
    const [busLogs, setBusLogs] = useState<any[] | null>(null)
    const [messageOpen, setMessageOpen] = useState(false)
    const [location, setLocation] = useState({...defaultLocation})

    const classes = useStyles()
    const init = (busData) => {
        setFilter({...defaultValue, BUS_ID : busData[0][0]['BUS_ID']})
        setSelected(-1)
    }, 
    showButton = {label : '조회하기', action : () => {
        if(logFilter['BUS_ID'] === -1 || logFilter['DATE'] === '') {
            
            return;
        }
        setState('request_log')
        getAPI(`bus/log/all?bus_id=${logFilter['BUS_ID']}&date_time=${logFilter['DATE']}`).then(res=>{
            setSelected(-1)
            setBusLogs(res)
            if(res.length > 1) {
                setLocation({
                    lat : res[0]['BUS_LATITUDE'],
                    lng : res[0]['BUS_LONGITUDE'],
                })
            }
            setState('show');
        })
    }} 

    //setting table head data
    useEffect(()=> {
        getData().then(res => {
            busData[0] = res['busData'].filter(bus => bus['IS_SHUTTLE'] === 0)
            busData[1] = res['busData'].filter(bus => bus['IS_SHUTTLE'] === 1)
            init(busData)
            setState('show')
        })
        return () => setState('apply')
    }, [])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

    const leftContainer = () => {
        if (stat === 'request_log') {
            return <NoData message='요청중' />
        }
        else if(busLogs === null)
            return <NoData message='Please Select Options' />
        else if(busLogs.length === 0)
            return <NoData message={`data is empty`} />
        else {
            return <Table
                column = {['로그']}
                isrowHead={false}
                record = {busLogs.map(log => [log['DATE_TIME']])}
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
        }
    }
    const form = [
        [   //Basic Information
            {
              label : '종류',
              type : 'select',
              options : [
                {label : '셔틀', value : 1},
                {label : '통학', value : 0},
              ],
              onChange : value => {
                setFilter({...logFilter, 
                    IS_SHUTTLE : value,
                    BUS_ID : busData[value][0]['BUS_ID']
                })
              } ,
              value : logFilter['IS_SHUTTLE'],
          },
        ], [   //Selected Information
          {
              label : '버스번호',
              type : 'select',
              options : busData[logFilter['IS_SHUTTLE']].map(bus => ({
                  label : bus['BUS_NUM'],
                  value : bus['BUS_ID']
              })),
              onChange : value => setFilter({...logFilter, BUS_ID : value}),
              value : logFilter['BUS_ID'],
          }, {
            label : '날짜',
            type : 'date',
            onChange : value => {
                setFilter({...logFilter, DATE : value.target.value})
            },
            value : logFilter['DATE'],
          },
        ]
    ]

    const rowClick = idx => {
        if(busLogs !== null) {
            setSelected(idx)
            setLocation({
                lat : busLogs[idx]['BUS_LATITUDE'],
                lng : busLogs[idx]['BUS_LONGITUDE'],
            })
        }
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
                    {leftContainer()}
                </div>
                
                <div className={classes.configBox}>
                    <Toolbar
                        title='로그 관리'
                        inputForm={form} 
                        buttons={[showButton]}
                    ></Toolbar>
                    <div>
                        <GoogleMap 
                            markerChange={false}
                            markerIcon="https://icon-icons.com/downloadimage.php?id=90572&root=1369/PNG/32/&file=-directions-bus_90572.png"
                            selectedIcon = "https://icon-icons.com/downloadimage.php?id=28256&root=259/PNG/32/&file=ic_directions_bus_128_28256.png"
                            markers = {busLogs !== null ? 
                                (selected !== -1 ? [busLogs[selected]] : busLogs)
                                : []}
                            defaultCenter={location}
                        />
                    </div>
                </div>
            </div>
            <Warning onClose={() => setMessageOpen(false)} title={'경고'} open={messageOpen}>필수항목을 입력하지 않았습니다.</Warning>
        </div>
    )
}
export default BusLine