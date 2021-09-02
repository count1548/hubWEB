/*eslint-disable */
import Button from '@material-ui/core/Button'
import Loading from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from "react"
import Dialog from '../../component/Dialog'
import GoogleMap from '../../component/Map'
import Table from '../../component/Table'
import Toolbar from '../../component/Toolbar'
import { getAPI, isAvailable, setAPI } from '../../data_function'
import '../../style/font.css'

async function getData() {
    const stop = await getAPI('bus/shuttle/stop/')
    if(!isAvailable(stop)) return []
    return stop
}

let stopData:any[] = []
interface stopInterface {
    IDX?:number,
    SHUTTLE_STOP_NAME : string, DETAIL? : string,
}

const defaultValue:stopInterface = {
    SHUTTLE_STOP_NAME : '', DETAIL : '',
}

let stopInfo:stopInterface = {...defaultValue} as any

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
}

const StopList = props => {
    const [updated, setUpdated] = useState(true)
    const [stat, setState] = useState('apply')
    const [selected, setSelected] =  useState<number|null>(null)
    const [location, setLocation] = useState({lat: 0, lng: 0 })
    const [required, setRequired] = useState(false)

    const [zoom, setZoom] = useState(11)
    const classes = useStyles()
    const init = () => {
        stopInfo = {...defaultValue}
        setLocation({lat:0, lng:0})
        setSelected(null)
    }

    //setting table head data
    useEffect(()=> {
        getData().then(res => {
            stopData = res
            setState('show')
        })
    }, [updated])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

    const rows = stopData.map(value => [value['SHUTTLE_STOP_NAME']])
    const AnyReactComponent = ({ lat, lng, text }) => <div>{text}</div>;

    const form = [
        [   //Basic Information
            {
                label : '이름',
                type : 'text',
                onChange : value => {stopInfo['SHUTTLE_STOP_NAME'] = value} ,
                value : stopInfo['SHUTTLE_STOP_NAME'],
            },
            {
                label : '추가정보',
                type : 'text',
                onChange: value => { stopInfo['DETAIL'] = value },
                value : stopInfo['DETAIL'] === null ? '' : stopInfo['DETAIL']
            },
        ], [   //Location
            {
                label : '위도',
                type : 'text',
                textType : 'number',
                onChange: value => {
                    setLocation({...location, lat:value})
                 },
                value : location.lat
            },
            {
                label : '경도',
                type : 'text',
                textType : 'number',
                onChange: value => {
                    setLocation({...location, lng:value})
                 },
                value : location.lng
            },
        ],
    ]
    const buttonClick = () => {
        const url = (selected === null) ? 'create' : 'update'
        if(stopInfo['SHUTTLE_STOP_NAME'] === '') {
            setRequired(true)
            return
        }
        setState('apply')
        setAPI(`shuttle/stop/${url}`, {...stopInfo, 
            LATITUDE : location.lat,
            LONGITUDE : location.lng, })
            .then(res => { init(); setUpdated(!updated) })
    }
    const rowClick = (idx) => {
        if(selected === idx) {init(); return}
        const {LATITUDE, LONGITUDE, ...mainInfo} = stopData[idx]
        stopInfo = {...mainInfo}
        defaultLocation = {
            lat : LATITUDE, 
            lng : LONGITUDE
        }
        setSelected(idx)
        setLocation({
            lat : LATITUDE,
            lng : LONGITUDE
        })
    }
    return (

        <div className='main-warp'>
            <Dialog
                children={'필수 항목을 입력하십시오'}
                onClose = {()=>setRequired(false)}
                defaultState={required}
            />
            <div className={classes.pageTitle}>정류장 관리</div>
            <div className={classes.mainContent}>
                <div className={classes.table}>
                    <Table
                        column = {['정류장']}
                        isrowHead={false}
                        record = {rows}
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
                        onClick = {(location) => {
                            setLocation(location)
                        }}
                        defaultCenter={defaultLocation}
                    />
                </div>
            </div>
            <Button 
                variant="contained" 
                color='primary' 
                onClick={buttonClick}
                className={classes.button}>submit</Button>
        </div>
    )
}
export default StopList