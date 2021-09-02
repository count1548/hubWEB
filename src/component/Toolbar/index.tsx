/*eslint-disable */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from "react";
import '../../style/font.css';
import SelectForm from '../Table/SelectForm';
import PrefixTextField from './PfixTextField';
 
const useStyles = makeStyles((theme) => ({
    toolbar : {
        width:'calc(100% - 10px)',
        minHeight: '70px', padding:'5px',
        background: '#eee',
        borderRadius:'20px',
        margin:'0 auto',
        marginBottom:'30px',
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both',
        },
    },
    head: {
        position:'relative',
        textAlign:'center',
        fontSize:'24px',
        marginBottom:'20px',
        fontFamily:'NanumSquareRoundEB',
        fontWeight: 'bold',
        height:'32px',
        color:'#2c537a',
        width:'100%',
        '&:after' : {
            content:'attr(data-text)',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '-1',
            width:'100%',
        },
    },
    button : {
        float:'right',
        fontSize:'15px',
        marginTop: '9px',
        fontWeight:'normal',
        marginLeft:'10px',
        cursor:'pointer'
    }, labelStyle : {
        color : '#2d587c',
        position : 'relative',
        fontSize : '20px',
        fontFamily : 'NanumSquareRoundEB',
        fontWeight : 'bold',
        paddingLeft:'20px'
    }
}));

const Header = ({component, style, button}) =>
    <div className={style} data-text={component}>{button}</div>

const SelectBox = ({children, style=''}) => <div className={style}> {children} </div>
const DateBox = ({label, value, onChange, width, fullWidth = false}) => {
    return (
        <TextField
            id="date"
            label={label}
            type="date"
            value = {value}
            variant="outlined" 
            onChange = {onChange}
            style = {{width:fullWidth ? 500 : 190, marginTop:8, marginLeft:10, backgroundColor:'#fff'}}
            InputLabelProps={{
            shrink: true,
            }}/>
    )
        
}
const TextForm = ({label, onChange, name, value='', textType = 'text', fullWidth, type}) => {
    const [text, setText] = useState<any>(value)
    useEffect(() => {
        setText(value)
    }, [value])
    const textField = (textType === 'money') ? 
        <PrefixTextField
            id={label}
            label={label}
            defaultValue={value}
            onChange={value => onChange(value)}
        />
        :<TextField 
            id={label} 
            label={label} 
            variant="outlined" 
            value={text}
            type={textType}
            onChange={ev => {
                const val = ev.target.value
                setText(val)
                onChange(val)
            }}
            style = {{width:fullWidth ? 500 : 190, marginTop:8, marginLeft:10, backgroundColor:'#fff'}}/>
    return (
        <div style={{float : 'left'}}>
                {(typeof(name) === 'undefined') ? textField : 
                <FormControlLabel control={textField} label={name} labelPlacement="start" style={{
                    marginLeft:40
                }}/>
                }
        </div>
    )
}
const LabelForm = ({value}) => {
    const classes = useStyles()

    return (<div style = {{
        float:'left', paddingTop:'20px'
    }} className={classes.labelStyle}>
            {value}
    </div>)
}

const Toolbar = (props) => {
    const {header = true, title, inputForm = [], buttons=[]} = props
    const classes = useStyles()
    return (
        <div style={{
            marginBottom: '30px'}}>
            {header ? <Header 
                component={title} 
                style={classes.head} 
                button = {
                    buttons.map((data, idx) => 
                        <div className={classes.button} key={idx} onClick={data['action']}>{data['label']}</div>
            )}/> : null}
            <div>
            {
                inputForm.length === 0 ? null :
                inputForm.map((box, key) => 
                    <SelectBox style={classes.toolbar} key={key}>
                        {box.map((form, idx) => {
                            switch(form['type']) {
                                case 'select':
                                    return <SelectForm {...form} key={idx}/>
                                case 'text': case 'multi-text':
                                    return <TextForm {...form} key = {idx}/>
                                case 'date':
                                    return <DateBox {...form} key = {idx}/>
                                case 'label':
                                    return <LabelForm {...form} key = {idx}/>
                            }
                        })}
                    </SelectBox>)
            }
            </div>
        </div>
    )
}
export default Toolbar