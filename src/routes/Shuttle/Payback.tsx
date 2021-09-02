/*eslint-disable*/
import CircularProgress from '@material-ui/core/CircularProgress';
import koLocale from 'date-fns/locale/ko';
import Table from 'material-table';
import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button'
import { DateRange } from 'react-date-range';
import { addDays } from "date-fns"

import Warning from '../../component/Dialog/Warning';
import { getAPI } from '../../data_function';

import PatchedPagination from '../../component/Table/TablePagination'

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const columns = [
    {title : '학과', field : 'STUDENT_DEPT'},
    {title : '학번', field : 'STUDENT_ID'},
    {title : '이름', field : 'STUDENT_NAME'},
    {title : '환급횟수', field : 'PAYBACK'},
]

const Payback = ({match, history}) => {
    const [payback, setPayback] = useState<object[]>([])
    const [updated, setUpdated] = useState(false)
    const [state, setState] = useState('select')
    const [open, setOpen] = useState(true)
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ])  //date[0]에 startDate, endDate가 들어감 / 나중에 API 수정 시, 해당 데이터 가공해서 get요청 보내면 됨.
    useEffect(() => {
        if(state !== 'select')
        //API 요청 부분 / 포맷 가공해서 다시 보내면 됨. 
          getAPI(`bus/payback?start=${date[0].startDate}&end=${date[0].endDate}`).then(res => { 
            if(typeof res['message'] === 'undefined') setPayback(res)
            setState('show')
            setOpen(false)
        })
    }, [updated])

    if(state === 'select') return (
        <div style={{
            position:'relative',
            width:'351.96px', 
            margin:'0 auto', 
            textAlign:'center',
            top:'100%',
            transform: 'translateY(-50%)',
        }}>
            <div style={{margin:'10px auto', fontSize:'20px'}}>날짜를 선택해주세요</div>
            <DateRange
                editableDateInputs={true}
                onChange={item => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                locale={koLocale}
            />
            <Button 
                onClick={() => {
                    setState('apply')
                    setUpdated(!updated)
                }} 
                variant="contained" 
                color="primary">조회</Button>
        </div>
    )
    return (
        <>
        <Warning 
            open={open}
            onClose={()=>{}}
            submit={false}
            >데이터 양이 많아 잠시만 기다려주세요.</Warning>
        {
        state === 'apply' ? <div style={{width:'300px', margin:'30px auto'}}><CircularProgress size={200}/></div> :
        <Table
            title="페이백 현황"
            data={payback}
            columns={columns}
            options={{
                filtering : true,
                rowStyle: { backgroundColor: '#EEE', },
                pageSize: 100,
                exportButton:true,
                exportAllData : true,
            }}
            localization={{
                body: {
                    dateTimePickerLocalization: koLocale
                }
            }}
            onRowClick={(ev, data) => {
                if(typeof data !== 'undefined')
                    history.push(`/qrlog/${data['STUDENT_ID']}`)
            }}
            components = {{ Pagination : PatchedPagination }}
        />
        }
        </>
    )
}

export default Payback 
