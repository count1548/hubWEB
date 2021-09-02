import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import koLocale from 'date-fns/locale/ko';
import Table from 'material-table';
import React, { useEffect, useState } from "react";
import Warning from '../component/Dialog/Warning';
import SeatLayout from '../component/Tooltip/SeatLayout';
import Tooltip from '../component/Tooltip/Tooltip';
import PatchedPagination from '../component/Table/TablePagination'
import * as Data from '../data_function';

const columns = [
    {title : 'ID', field : 'TICKET_ID', width:10,},
    {title : '배차', field : 'OPERATION_ID', width:0, },
    {title : '학생', field : 'STUDENT_ID', width:100 },
    {title : '출발', field : 'TICKET_DATE', 
        width:150, type:"datetime" as const, render : rowData => <div>{rowData['TICKET_DATE']}</div>},
    {title : '출발지', field : 'TICKET_S_STATION'},
    {title : '도착지', field : 'TICKET_E_STATION'},
    {title : '좌석', field : 'SEAT_NUM', width:100, 
        render : rowData =>
            <Tooltip text = {<SeatLayout num = {rowData['SEAT_NUM']}/>}> {/*좌석 표시 툴팁*/}
                <div style={{
                    'textAlign' : 'center',
                    'backgroundColor' : '#aaa',
                    'borderRadius' : '5px',
                    'padding' : '10px 0',
                    'cursor' : 'default',
                }}>{rowData['SEAT_NUM']}</div>
            </Tooltip>
    },
    {title : '탑승', field : 'BOARDING', width:100, 
        lookup: { '탑승' : '탑승', '미탑승' : '미탑승' },
        render: rowData =>  //탑승 상태 color circle 로 표시
            <div style={{
                'width' : '30px',
                'height' : '30px',
                'borderRadius' : '50%', 
                'backgroundColor' : (rowData['BOARDING'] === '미탑승') ? 'red' : 'green',
                'margin' : '0 auto'
            }}></div>
    },
    {title : '패널티', field : 'is_penalty', width:100, lookup: { true : '유', false : '무' },
        render: rowData => 
            <div style={{
                'width' : '30px',
                'height' : '30px',
                'borderRadius' : '50%', 
                'backgroundColor' : rowData['is_penalty'] ? 'red' : 'green',
                'margin' : '0 auto'
            }}></div>
    },
    {title : '결재금액', field : 'PRICE', width:100, filtering: false },
    {title : '예약 날짜', field : 'RESV_DATE', 
        width:150, type:"datetime" as const, render : rowData => <div>{rowData['RESV_DATE']}</div>},
]

const TicketList = props => {
    const [tickets, setTickets] = useState<object[]>([])
    const [state, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
    const [open, setOpen] = useState(true)

    useEffect(() => {
        Data.getAPI('ticket/all/').then(res => {
            setTickets(res)
            setState('show')
            setOpen(false)
        })        
    }, [updated])
    return (
        <>
        <Warning 
            open={open}
            onClose={()=>{}}
            submit={false}
            >데이터 양이 많아 잠시만 기다려주세요.</Warning>
        {state === 'apply' ? <div style={{width:'300px', margin:'30px auto'}}><CircularProgress size={200}/></div> :
        <Table
            title="티켓 목록"
            data={tickets}
            columns={columns}
            options={{
                filtering: true,
                rowStyle: { 
                    backgroundColor: '#EEE', 
                },
                selection: true,
                pageSize: 10,
                exportButton:true,
                exportAllData : true,
            }}
            localization={{
                body: {
                    dateTimePickerLocalization: koLocale
                }
            }}
            actions={[
                {
                  tooltip: 'Remove penalty log',
                  icon: () => <ConfirmationNumberIcon/>,
                  onClick: (evt, dataList:any[]) => {
                      setState('apply')
                      Data.setAPI('ticket/penalty/delete', {
                        TICKET_ID : dataList.map(value => value['TICKET_ID']).join(',')
                      }).then(res => setUpdated(!updated))
                  }
                }
            ]}
            components = {{ Pagination : PatchedPagination }}
        />}</>
    )
}

export default TicketList 
