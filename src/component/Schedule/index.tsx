import Button from '@material-ui/core/Button';
import React from 'react';
import AutoGenerationBox from '../Toolbar/AutoGenerationBox';

const Schedule = ({
    events, 
    line, 
    bus, 
    onSubmit = (data) => { console.log(data) },
    onClose = () => {},
}) => { //Schedule 편집 기능 Component
    let eventList = (typeof events === 'undefined') ? [] : events
    
    return (
        <div>
            <AutoGenerationBox 
                dataList={eventList}
                onChange={dataList => {
                    eventList = [...dataList]
                }}
                defaultData = {{ "ROUTE_ID" : null,  "BUS_ID" : null, "TIME" : '07:30'}}
                form = {[
                    {label : 'ROUTE_ID', type : 'select',
                    options : line.concat({
                        label : 'None',
                        value : null
                    }), width : 250,
                    }, 
                    {label : 'BUS_ID', type : 'select', 
                    options : bus.concat({
                        label : 'None',
                        value : null
                    }), width : 150,
                    },
                    {label : 'TIME', type : 'time', width : 150},
                ]}
            />
            <Button onClick={()=>{
                eventList.pop();
                onSubmit(eventList)
                onClose()
            }} color="primary" autoFocus>
                적용
            </Button>
            <Button onClick={()=>{ onClose() }} color="secondary">
                취소
            </Button>
        </div>
    )
}
export default Schedule