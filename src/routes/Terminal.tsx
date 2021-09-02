import CircularProgress from '@material-ui/core/CircularProgress';
import Table from 'material-table';
import React, { useEffect, useState } from "react";
import Warning from '../component/Dialog/Warning';
import PatchedPagination from '../component/Table/TablePagination'

import * as Data from '../data_function';

const columns = [
    {title : 'ID', field : 'NFC_ID'},
    {title : '차량번호', field : 'BUS_NUM', width:200 },
    {title : '회사', field : 'COMPANY', },
    {title : '위도', field : 'BUS_LATITUDE', editable:'never' as const},
    {title : '경도', field : 'BUS_LONGITUDE', editable:'never' as const},
    {title : '종류', field : 'IS_SHUTTLE', lookup : {
        0 : '통학', 1 : '셔틀'
    }, width:200},
]

let dialogMessage = ''

const TerminalList = () => {
    const [terminals, setTerminals] = useState<object[]>([])
    const [state, setState] = useState('apply')
    const [messageOpen, setMessageOpen] = useState(false)
    
    const defaultEdit = {
        onRowAdd : newData => {
            return new Promise((resolve) => {
                Data.setAPI('bus/info/create/', {
                    ...newData
                }).then(result => {
                    dialogMessage = result['message']
                    setMessageOpen(true)
                    Data.getAPI('check/device/').then(res => {
                        setTerminals(res)
                        resolve(res)
                    }) 
                })
        })},
        onRowUpdate : newData => {
            return new Promise((resolve) => {
                Data.setAPI('bus/info/update/', {
                    ...newData,
                }).then(result => {
                    dialogMessage = result['message']
                    setMessageOpen(true)
                    Data.getAPI('check/device/').then(res => {
                        setTerminals(res)
                        resolve(res)
                    }) 
                })
        })},
        onRowDelete : oldData => {
            return new Promise((resolve) => {
                Data.setAPI('bus/info/delete/', {
                    ...oldData
                }).then(result => {
                    dialogMessage = result['message']
                    setMessageOpen(true)
                    Data.getAPI('check/device/').then(res => {
                        setTerminals(res)
                        resolve(res)
                    }) 
                })
        })},
    }

    useEffect(() => {
        Data.getAPI('check/device/').then(res => {
            setTerminals(res)
            setState('show')
        })        
    }, [])
    return (
        state === 'apply' ? <div style={{width:'300px', margin:'30px auto'}}><CircularProgress size={200}/></div> :
        <div>
            <Table
                title="단말기 목록"
                data={terminals}
                editable = {defaultEdit}
                columns={columns}
                options={{
                    filtering: true,
                    rowStyle: { 
                        backgroundColor: '#EEE', 
                    },
                    pageSize: 10,
                    exportButton:true,
                    exportAllData : true,
                }}
                components={{Pagination : PatchedPagination}}
            />
            <Warning 
            onClose={() => setMessageOpen(false)} 
            title={'메시지'} 
            open={messageOpen}>{dialogMessage}</Warning>
        </div>
    )
}

export default TerminalList 
