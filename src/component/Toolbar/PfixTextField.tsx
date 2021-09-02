import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';

let prefix = '￦'

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {   //텍스트박스 prefix Component
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix={prefix}
        />
    );
}

export default function FormattedInputs({ 
    id='',
    label='',
    defaultValue='',
    prifix_ch='￦', 
    onChange=(value)=>{} 
}) {
    const [value, setValue] = useState<string>(defaultValue);
    useEffect(()=>{
        setValue(defaultValue)
    }, [defaultValue])

    prefix = prifix_ch

    return (
        <div>
            <TextField
                id={id}
                label={label}
                value={value}
                onChange={ev => {
                    const val = ev.target.value
                    setValue(val)
                    onChange(val)
                }}
                variant="outlined" 
                name="numberformat"
                InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}
                style = {{width:190, marginTop:8, marginLeft:10, backgroundColor:'#fff'}}
            />
        </div>
    );
}
