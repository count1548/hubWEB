/*eslint-disable */
import Button from '@material-ui/core/Button'
import Loading from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from "react"
import Warning from '../../component/Dialog/Warning'
import GoogleMap from '../../component/Map'
import Table from '../../component/Table'
import NoData from '../../component/Table/NoData'
import Toolbar from '../../component/Toolbar'
import { getAPI, setAPI } from '../../data_function'
import '../../style/font.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table : {
        width : '30%',
        float : 'left'
    },
    configBox : {
        width : 'calc(70% - 10px)',
        paddingLeft:'10px',
        float: 'right' as const
    },
    button : {
        display:'block',
        padding : '10',
        margin : '10px auto'
    },
    mainContent : {
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both'
        }
    },
    pageTitle : {
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
let defaultLocation = {
    lat: 36.734944,
    lng: 127.07475
}, notice:string = ''
const localData = [ ]
const StopList = props => {
    const [updated, setUpdated] = useState(true)
    const [stat, setState] = useState('apply')
    const [busData, setBusData] = useState<any[]>([])
    const [selected, setSelected] = useState<number>(0)
    const [error, setError] = useState(false)
    const classes = useStyles()
    
    const init = (data) => { 
        defaultLocation = {
            lat : data['BUS_LATITUDE'],
            lng : data['BUS_LONGITUDE']
        }; notice = data['BUS_NOTICE']
    }
    
    //setting table head data
    useEffect(()=> {
        //getAPI('gps/shuttle/')
        getAPI('gps/shuttle/').then(res => {
            init(res[0])
            setBusData(res)
        })
        .catch(err => setBusData(localData))
        .finally(() => setState('show') )
        const id = setInterval(() => {
            getAPI('gps/shuttle/')
            .then(res => setBusData(res))
            .catch(err => setBusData(localData) )
        }, 60000)
        return () => {
            clearInterval(id)
            setState('apply')
        }
    }, [updated])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>
    if(busData.length === 0) return <NoData message='운행중인 버스가 존재하지 않습니다.'/>

    const rowClick = idx => {
        if(selected === idx) return
        const {BUS_LATITUDE, BUS_LONGITUDE, BUS_NOTICE} = busData[idx]
        defaultLocation = {
            lat : BUS_LATITUDE, 
            lng : BUS_LONGITUDE
        }; notice = BUS_NOTICE
        setSelected(idx)
    }

    const form = [[
        { type : 'label', value : busData[selected]['BUS_NUM'] }, {
            label : '메모', type : 'text', 
            onChange : value => {notice = value},
            value : busData[selected]['BUS_NOTICE'], fullWidth : true
        }
    ]]
    return (
        <div className='main-warp'>
            <div className={classes.pageTitle}>실시간 버스 위치</div>
            <div className={classes.mainContent}>
                <div className={classes.table}>
                    <Table
                        column = {['버스번호']}
                        isrowHead={false}
                        record = {busData.map(value => [value['BUS_NUM']])}
                        defaultSelected = {0}
                        doubleClick={false}
                        headWidth={50}
                        onClick={rowClick}
                        maxHeight={735}
                        selectable={true}
                        selecteCount={1}
                        style={{
                            selectedRowCell : {
                                backgroundColor:'#777'
                            }
                        }}
                    />
                </div>
                
                <div className={classes.configBox}>
                    <Toolbar
                        header={false}
                        inputForm={form}
                    ></Toolbar>
                    <GoogleMap
                        markerChange={false}
                        markerIcon="https://icon-icons.com/downloadimage.php?id=90572&root=1369/PNG/32/&file=-directions-bus_90572.png"
                        selectedIcon = "https://icon-icons.com/downloadimage.php?id=28256&root=259/PNG/32/&file=ic_directions_bus_128_28256.png"
                        markers = {busData}
                        defaultCenter={defaultLocation}
                    />
                </div>
            </div>
            <Button 
                variant="contained"
                color='primary'
                onClick={() => {
                    setState('apply')
                    setAPI('bus/notice/update', {
                        ID : busData[selected]['BUS_ID'],
                        notice : notice
                    }).then(res => setUpdated(!updated) )
                    .catch(res => {
                        setError(true)
                        setUpdated(!updated)
                    } )
                }}
                className={classes.button}>submit</Button>
            <Warning 
                open={error}
                onClose={() => setError(false)}>
                    수정 오류입니다. 관리자에게 문의하세요.
            </Warning>
        </div>
    )
}
export default StopList