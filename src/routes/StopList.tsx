/*eslint-disable */
import Button from '@material-ui/core/Button'
import Loading from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from "react"
import Warning from '../component/Dialog/Warning'
import GoogleMap from '../component/Map'
import Table from '../component/Table'
import Toolbar from '../component/Toolbar'
import { getAPI, isAvailable, setAPI } from '../data_function'
import '../style/font.css'

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
interface stationInterface {
    STATION_ID : number,
    STATION_NAME : string, STATION_ADDR : string,
    STATION_LATITUDE :number, STATION_LONGITUDE: number,
    IS_SHUTTLE_STATION : number, IS_SCHOOL : number, BOUND : number,
}

async function getData() {
    const station = await getAPI('bus/all/')
    if(!isAvailable(station)) return []

    return station
}
let stationsData:any[] = []

let defaultLocation = {
    lat: 36.734944,
    lng: 127.07475
}
const defaultValue:stationInterface = {
    STATION_ID : -1,
    STATION_NAME : '', STATION_ADDR : '',
    STATION_LATITUDE : defaultLocation.lat, STATION_LONGITUDE: defaultLocation.lng,
    IS_SHUTTLE_STATION : 0, IS_SCHOOL : 0, BOUND : 1,
}
const IS_SHUTTLE_CHAR = ['통학', '셔틀', '모두', '미정']
const StopList = props => {
    const [updated, setUpdated] = useState(true)
    const [stat, setState] = useState('apply')
    const [selected, setSelected] = useState(0)
    const [stationData, setStation] = useState<stationInterface>({...defaultValue})
    const [messageOpen, setMessageOpen] = useState(false)

    const classes = useStyles()
    const init = () => {
        setStation({...defaultValue})
    }, createButton = {label : '생성하기', action : () => {
        setSelected(-1)
        init()
    }}, deleteButton = {label : '삭제하기', action : () => {
        if(selected === -1) return
        setState('apply')
        setAPI('bus/station/delete', {
            STATION_ID : stationsData[selected]['STATION_ID']
        }).then(res => setUpdated(!updated))
    }}

    //setting table head data
    useEffect(()=> {
        getData().then(res => {
            stationsData = res
            setSelected(0)
            setStation({...res[0]})
            setState('show')
        })
        return () => setState('apply')
    }, [updated])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

    const rows = stationsData.map(value => [IS_SHUTTLE_CHAR[value['IS_SHUTTLE_STATION']], value['STATION_NAME']])

    const form = [
        [   //Basic Information
            {
                label : '이름',
                type : 'text',
                onChange : value => setStation({...stationData, STATION_NAME : value}) ,
                value : stationData['STATION_NAME'],
            },
            {
                label : '추가정보',
                type : 'text',
                onChange: value => setStation({...stationData, STATION_ADDR : value}) ,
                value : stationData['STATION_ADDR']
            },
        ], [   //Selected Information
            {
                label : '종류',
                type : 'select',
                options : IS_SHUTTLE_CHAR.map((val, idx) => ({
                    value : idx,
                    label : val
                })),
                onChange : value => setStation({...stationData, IS_SHUTTLE_STATION : value}) ,
                value : stationData['IS_SHUTTLE_STATION'],
            },
            {
                label : '학교유무',
                type : 'select',
                options : [
                    {value : 0, label : '무'},
                    {value : 1, label : '유'},
                ],
                onChange: value => setStation({...stationData, IS_SCHOOL : value}) ,
                value : stationData['IS_SCHOOL']
            },
            {
                label : '등하교',
                type : 'select',
                options : [
                    {value : 2, label : '모두'},
                    {value : 1, label : '등교'},
                    {value : 0, label : '하교'},
                ],
                onChange: value => setStation({...stationData, BOUND : value}) ,
                value : stationData['BOUND'],
                disable : () => stationData['IS_SHUTTLE_STATION'] === 1,
            },
        ], [   //Location
            {
                label : '위도',
                type : 'text',
                textType : 'number',
                onChange : value => setStation({...stationData, STATION_LATITUDE : value}) ,
                value : stationData['STATION_LATITUDE'],
            },
            {
                label : '경도',
                type : 'text',
                textType : 'number',
                onChange : value => setStation({...stationData, STATION_LONGITUDE : value}) ,
                value : stationData['STATION_LONGITUDE'],
            },
        ],
    ]
    const isAvailData = data => {
        return !(
            data['STATION_NAME'] === '' ||
            data['STATION_ADDR'] === ''
        )
    }
    const buttonClick = () => {
        const target = (selected === -1) ? 'create' : 'update'

        if(!isAvailData(stationData)) {
            setMessageOpen(true)
            return;
        }

        setState('apply')
        setAPI(`bus/station/${target}`, {
            ...stationData
        }).then(res => setUpdated(!updated))
    }

    const rowClick = idx => {
        setSelected(idx)
        setStation(stationsData[idx])
    }

    return (
        <div className='main-warp'>
            <div className={classes.mainContent}>
                <div className={classes.table}>
                    <Table
                        column = {['종류', '정류장']}
                        isrowHead={false}
                        record = {rows}
                        headWidth={50}
                        onClick={rowClick}
                        maxHeight={735}
                        selectable={true}
                        selecteCount={1}
                        style={{ selectedRowCell : { backgroundColor:'#777' } }}
                        defaultSelected={selected}
                        doubleClick={false}
                    />
                </div>

                <div className={classes.configBox}>
                    <Toolbar
                        title='정류장 관리'
                        inputForm={form}
                        buttons={[createButton, deleteButton]}
                    ></Toolbar>
                    <GoogleMap
                        onClick = {loc => {
                            setStation({
                                ...stationData,
                                STATION_LATITUDE : loc.lat,
                                STATION_LONGITUDE : loc.lng
                            })
                        }}
                        defaultCenter={{
                            lat : stationData['STATION_LATITUDE'],
                            lng : stationData['STATION_LONGITUDE']
                        }}
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
export default StopList