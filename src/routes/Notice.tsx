import Loading from '@material-ui/core/CircularProgress'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import Table from 'material-table'
import React, { useEffect, useState } from "react"
import Dialog from '../component/Dialog'
import Notice from '../component/Notice'
import NoData from '../component/Table/NoData'
import Toolbar from '../component/Toolbar'
import { getAPI, setAPI } from '../data_function'

const columns = [
    {title : '번호', field : 'IDX', width : 90, },
    {title : '제목', field : 'TITLE', width : 120 },
    {title : '내용', field : 'CONTENT', 
        render : rowData => {
            return <div style={{
                whiteSpace:'nowrap',
                overflow:'hidden',
                textOverflow:'ellipsis',
                width:'300px'
            }}>{rowData['CONTENT']}</div>
        }
    },
    {title : '시간', field : 'TIME'},
    {title : '파일', field : 'FILE_SRC', 
        render : rowData =>
            rowData['FILE_SRC'] ? <AttachFileIcon/> : null
    }, {title : '이미지', field : 'IMAGE_SRC', 
    render : rowData =>
        rowData['IMAGE_SRC'] ? <AttachFileIcon/> : null
}, ],
    defaultData = {
        IDX : -1, TITLE : '', CONTENT : '',
        MODIFY_TIME : null, IMAGE_SRC : null, FILE_SRC : null, IMAGE : null, FILE : null,
    }

const NoticeList = props => {
    const [notices, setNotices] = useState<object[] | null>(null)
    const [notice, setNotice] = useState<object | null>(null)
    const [state, setState] = useState('show')
    const [push, setPush] = useState(false)
    const [message, setMessage] = useState('푸시 요청을 보냈습니다.')
    const [open, setOpen] = useState(false)
    const [updated, setUpdated] = useState(true)

    useEffect(() => {
        getAPI('notice/list/').then(res => {
            setNotices(res)
            setState('show')
        }).catch(err => console.log(err) )
    }, [updated])

    if (state === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>
    const rowClickHandle = (ev, data) => { setNotice(data); setState('show-notice') }

    const applyData = async (data) => {
        let pushData = {}, flag = true
        for(var item of data.entries()) { 
            if(item[0] === 'TITLE') pushData['title'] = item[1]
            if(item[0] === 'CONTENT') pushData['body'] = item[1]
        }
        await setAPI('notice/', pushData).then(res => {
            setUpdated(!updated)
        }).catch(err => {
            flag = false
        })
        return flag
    }
    
    const getButton = (state) => {
        const buttons = { 
            create : {label : '글쓰기', action : () => setState('create-notice')},
            return : {label : '돌아가기', action : () => setState('show')},
            visible : {label : 'PUSH', action : () => setOpen(true)}
        }
        const button : Object[] = []
        if(state === 'show-notice' || state === 'create-notice')
            button.push(buttons.return)
        else button.push(buttons.visible, buttons.create)

        return button
    }


    const displayComponent = () => {
        if(notices === null) return <NoData message='Please Select Options' />
        switch(state) {
            case 'show':
                return (
                    <div>
                        <Table
                        title="공지 목록"
                        data={notices}
                        columns={columns}
                        options={{
                            rowStyle: { backgroundColor: '#EEE', },
                            actionsColumnIndex: -1,
                            pageSize: 10
                        }} onRowClick = {rowClickHandle}
                        actions= {[{
                            icon:'delete',
                            onClick : (ev, data) => {
                                setState('apply')
                                setAPI('notice/delete', 
                                    {IDX : data['IDX']}).then(res => setUpdated(!updated))
                            }
                        }]}
                        />
                    </div>
                )
            case 'show-notice':
                return <Notice {...notice} onSubmit = {data => {
                    setState('apply')
                    setAPI('notice/modify/', data, true).then(res => applyData(data))
                }}/>
            case 'create-notice':
                return <Notice {...defaultData} onSubmit = {data => {
                    setState('apply')
                    setAPI('notice/upload/', data, true).then(res => applyData(data))
                }}/>
        }
    }

    return <div>
        <Toolbar title='공지관리' buttons = {getButton(state)}></Toolbar>
        {displayComponent()}
        <Dialog
            onClose={() => {
                setOpen(false) 
                setTimeout(() => setPush(false), 500)
            }}
            submitMsg="확인"
            submit = {push}
            reset={false}
            type={'component'}
            title={`모바일 PUSH`}
            defaultState={open}>
            {push ? <div>{message}</div> : <Notice {...defaultData} onSubmit = {data => {
                applyData(data).then(res => {
                    res ? setMessage('푸시 요청을 보냈습니다.') : setMessage('오류입니다. 관리자에게 문의해주세요')
                    setPush(true)
                })
            }}  imageE = {false} fileE = {false}/>}
        </Dialog>
    </div>
}

export default NoticeList 
