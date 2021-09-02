/*eslint-disable */
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from "react";
import '../../style/font.css';
 
const useStyles = makeStyles((theme) => ({
    container : {
        width:'calc(100% - 10px)',
        height: '450px', padding:'5px', overflowY:'auto',
        background: '#eee',
        borderRadius:'20px',
        margin:'0 auto',
    },
    box : {
        display : 'block',
        width : 'calc(100% - 5px)',
        padding : '2px 2.5px',
        margin : '5px auto',
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both',
        },
    }
}));
const Box = ({children}) => {
    const classes = useStyles()
    return <div className = {classes.box}>{children}</div>
}

const AutoGenerationBox = (props) => {  //다중 item 입력창 Component
    const {dataList = [], onChange = (data) => {}, defaultData, form} = props
    const [nowData, setNowData] = useState<Object[]>([])
    
    const classes = useStyles()
    let c_dataList:any[] = []
    const onDataCreate = () => {    //항목 생성
        c_dataList = [...nowData]
        c_dataList.push({ ...defaultData })

        setNowData(c_dataList)
        onChange(c_dataList)
    }

    const onDataDelete = idx => {   //항목 삭제
        c_dataList = nowData.filter((val, i) => i !== idx)
        setNowData(c_dataList)
        onChange(c_dataList)
    }

    useEffect(() => {
        const initData = [...dataList, {...defaultData}]
        setNowData([...initData])
        onChange([...initData])
    }, [dataList])

    const createForm = (formData, idx = -1) => {
        let content:any

        const onValueChange = (newData, target) => {
            if(newData === null) newData = {label:'None', value:null}
            
            c_dataList = nowData.map((val, i) => ({
                ...val,
                [target] : (i === idx) ? newData['value'] : val[target]
            }))
            setNowData(c_dataList)
            onChange(c_dataList)
        }
        return <div>
            {
                formData.map((form, key) => {
                    const _value = nowData[idx][form.label]
                    const _disable = typeof form['disable'] === 'undefined' ? false : form.disable(idx)
                    switch(form.type) {
                        case 'select':
                            content = <Autocomplete
                                options={form.options}
                                getOptionLabel={(option:any) => option['label']}
                                onChange={(ev, newData) => {
                                    onValueChange(newData, form.label)
                                }}
                                style={{ width: form.width }}
                                renderInput={(params) => 
                                    <TextField {...params} 
                                        label={form.label} 
                                        size='small' 
                                        variant="outlined"
                                        disabled={_disable}
                                        />}
                                value={form.options.find(val => val['value'] === _value)}
                            />
                            break
                        case 'text':
                            content = <TextField
                                label={form.label}
                                variant="outlined" 
                                onChange={(ev) => {
                                    onValueChange(ev.target, form.label)
                                }}
                                value={_value}
                                style={{width: form.width}}
                                disabled={_disable}
                                size='small'
                                />
                            break
                        case 'number':
                            content = <TextField
                                label={form.label}
                                variant="outlined" 
                                onChange={(ev) => {
                                    onValueChange(ev.target, form.label)
                                }}
                                type="number"
                                value={_value}
                                style={{width: form.width}}
                                disabled={_disable}
                                size='small'
                                />
                            break
                        case 'time':
                            content = <TextField
                                label={form.label}
                                variant="outlined" 
                                onChange={(ev) => {
                                    onValueChange(ev.target, form.label)
                                }}
                                type="time"
                                value={_value}
                                style={{width: form.width}}
                                size='small'
                                InputLabelProps={{shrink: true,}}
                                disabled={_disable}
                                inputProps={{
                                    step: 300, // 5 min
                                }}/>
                            break
                    }
                    return (
                        <div style={{float:'left'}} key={key}>
                            {content}
                        </div>
                    )
                })
            } {
                (idx === nowData.length - 1) ? 
                (<Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => onDataCreate()}
                    style={{padding:'7px 0'}}>
                    +
                </Button>) : 
                (<Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => onDataDelete(idx)}
                    style={{padding:'7px 0'}}>
                    -
                </Button>)
            }
        </div>
    }

    return (
        <div className = {classes.container}>
            {nowData.map((value, idx) => {
                return <Box key={idx}>{ createForm(form, idx) }</Box>
            })}
        </div>
    )
}
export default AutoGenerationBox