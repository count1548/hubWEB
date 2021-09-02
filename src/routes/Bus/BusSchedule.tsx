/*eslint-disable*/
import FullCalendar, { EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import Loading from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import Container from '../../component/Container'
import TextLabel from '../../component/Container/TextLabel'
import Dialog from '../../component/Dialog'
import Schedule from '../../component/Schedule'
import NoData from '../../component/Table/NoData'
import SeatLayout from '../../component/Tooltip/SeatLayout'
import { getAPI, isAvailable, setAPI } from '../../data_function'
const moment = require('moment')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    event : {
      width : '100%',
      padding : '4px',
      borderRadius : '2px',
      backgroundColor : 'powderblue',
      color : 'black',
      '& > b' : {
        width : '38px',
      },
      '& i' : {
        display : 'inline-block',
        paddingLeft : '5px',
        width : '100px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    mainContent : {
      width : '600px',
      padding : '30px',
      borderRadius : '5px',
      background : '#ccc',
      '&:after' : {
          content : '\' \'',
          display : 'block',
          clear : 'both'
      }
  },
  })
)

async function getData() {
  const line = await getAPI('bus/line/')
  const bus = await getAPI('check/device?is_shuttle=0')
  const schedule = await getAPI('bus/operation/read')

  return {
    linesData : isAvailable(line) ? line : [],
    bus_schedule : isAvailable(schedule) ? schedule.map(event => ({
      ...event,
      id : event['OPERATION_ID'],
      date : event['OPERATION_DATE'].split(' ')[0],
      TIME : event['OPERATION_DATE'].split(' ')[1],
      title : event['DIRECTION']
    })) : [],
    busData : isAvailable(bus) ? bus : [],
  }
}
let linesData:any[] = [], busData:any[] = [], bus_schedule:Object[] = [], nowDate:string = ''
let selectedBus:Object, seatData:Object

const BusSchedule = props => {
  const [schedule_open, setScheduleOpen] = useState(false)
  const [bus_open, setBusOpen] = useState(false)
  const [updated, setUpdated] = useState(true)
  const [stat, setState] = useState('apply')
  const [selectedDate, setSelectedDate] = useState('')
  const classes = useStyles()
  /*
   *schedule_open : 스케줄 선택 Dialog 
   * bus_open : 버스 상태 Dialog
   * updated : 데이터 상태 변경
   * stat : 현재 상태 정보
   * selectedDate : 선택 날짜
   */
  const onSelect = (selectInfo) => {    //스케줄 선택 이벤트
    nowDate = moment(selectInfo['date']).format('YYYY-MM-DD')
    setSelectedDate(nowDate)
    setScheduleOpen(true)
  }
  const handleEventClick = (clickInfo) => { //클릭 이벤트
    const evData = clickInfo.event.extendedProps
    selectedBus = busData.find(bus => bus['BUS_ID'] === evData['BUS_ID'])
    seatData = JSON.parse(evData['TICKET_STATUS'])['seat']
    
    setBusOpen(true)
  }
  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <div className={classes.event}>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </div>
    )
  }

  useEffect(()=> {
    getData().then(res => {
      ({bus_schedule, linesData, busData} = res)
      setState('show')
    })
  }, [updated])

  if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

  const events = (selectedDate === '') ? [] : bus_schedule.filter(data => (data['date'].indexOf(selectedDate) !== -1))

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        initialView='dayGridMonth'
        editable={true}
        dateClick={onSelect}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={bus_schedule} // alternatively, use the `events` setting to fetch from a feed
        select={onSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        unselectAuto={true}
        />
        
      <Dialog //스케줄 Dialog
        onClose={() => setScheduleOpen(false)}
        type={'component'}
        title={`버스 스케줄 [${nowDate}]`}
        defaultState={schedule_open}
        submit = {false} reset = {false}>
        <Schedule events={events} line = {linesData.map(data => ({
            label : data['DIRECTION'],
            value : data['ROUTE_ID'],
          }))} bus = {busData.map(data => ({
            label : data['BUS_NUM'],
            value : data['BUS_ID'],
          }))}
          onSubmit = {dataList => {
            setState('apply')
            setAPI('bus/operation/config', {
              [selectedDate] : dataList.map(event => ({
                ...event,
                ...(typeof event['OPERATION_ID'] === 'undefined' ? {OPERATION_ID : -1} : null)
              }))}
            ).then(res => setUpdated(!updated))
            setScheduleOpen(false)
          }}
          onClose = {() => {
            setScheduleOpen(false)
          }}
        />  
      </Dialog>
      <Dialog //버스 상태 Dialog
        onSubmit = {()=>{
        }} onClose={() => setBusOpen(false)}
        submitMsg = {'확인'}
        reset={false}
        type={'component'}
        title={`버스 현황`}
        defaultState={bus_open}>
        <div className={classes.mainContent}>
          {(typeof selectedBus === 'undefined') ? <NoData message='해당 버스 정보가 존재하지 않습니다.' /> : 
            <div>
              <Container 
                  title={'버스정보'}
                  width={'45%'}
                  align={'left'}>
                  <TextLabel label={'버스번호'}>{selectedBus['BUS_NUM']}</TextLabel>
                  <TextLabel label={'NFC장비'}>{selectedBus['NFC_ID']}</TextLabel>
                  <TextLabel label={'버스메모'}>{selectedBus['BUS_NOTICFE']}</TextLabel>
              </Container>
              <Container 
                    title={'예약현황'}
                    width={'45%'}
                    align={'right'}>
                    <SeatLayout num={seatData}/>
              </Container>
            </div>
          }
          
        </div>
      </Dialog>
    </>
  )
}

export default BusSchedule