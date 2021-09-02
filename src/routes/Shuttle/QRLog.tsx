/*eslint-disable*/
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import koLocale from 'date-fns/locale/ko';
import Table from 'material-table';
import React, { useEffect, useState } from "react";
import Warning from '../../component/Dialog/Warning';
import PatchedPagination from '../../component/Table/TablePagination'
import * as Data from '../../data_function';


const columns:any[] = [   //컬럼 정보
    {title : 'IDX', field : 'IDX', hidden : true, width:0,},
    {title : '학번', field : 'STUDENT_ID', width : 150},
    {title : '탑승날짜', field : 'NFC_DATE', type:'date' as const},
    {title : '승차정류장', field : 'NFC_STATION' },
    {title : '승차시간', field : 'NFC_TIME', type:'time' as const },
    {title : 'BUS ID', field : 'BUS_ID', width : 150},
    {title : 'NFC', field : 'IS_NFC', width : 150},
    {title : 'STATE', field : 'STATE', width : 150},
]

const QRLog = ({match}) => {
    const [log, setLog] = useState<object[]>([])    //로그 데이터
    const [state, setState] = useState('apply')     //상태 
    const [updated, setUpdated] = useState(true)    //데이터 변경
    const [open, setOpen] = useState(true)
    useEffect(() => {
        if(match.params.id) columns[1].defaultFilter=match.params.id
        Data.getAPI('check/all/').then(res => {
            setLog(res)
            setState('show')
            setOpen(false)
        })
    }, [updated])

    const onInitData = () => {
        Data.setAPI('check/all/remove', {}).then(res => setUpdated(!updated))   
        //데이터 초기화 API / 변경시, URL 수정
    }

    return (
        <>
        <Warning 
            open={open}
            onClose={()=>{}}
            submit={false}
            >데이터 양이 많아 잠시만 기다려주세요.</Warning>
        {state === 'apply' ? <div style={{width:'300px', margin:'30px auto'}}><CircularProgress size={200}/></div> :
        <Table
            title="QR 기록"
            data={log}
            columns={columns}
            options={{
                filtering : true,
                rowStyle: { backgroundColor: '#EEE', },
                pageSize: 10,
                pageSizeOptions:[10, 20, 100],
                exportButton:true,
                exportAllData : true,
            }}
            localization={{
                body: {
                    dateTimePickerLocalization: koLocale
                }
            }}
            components = {{
                Actions: props => {
                    return <Tooltip title="초기화">
                        <IconButton onClick={onInitData}><DeleteForeverIcon/></IconButton>
                    </Tooltip>
                },
                Pagination : PatchedPagination
            }}
        />}
        </>
    )
}

export default QRLog 
