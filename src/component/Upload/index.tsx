import React from 'react'
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles'

interface uploadInterface {
    name : string;
    icon : any | null;
    onUpload : any,
    defaultSrc? : string | null;
    color? : string
}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        labelBox : {
            display:'block',
            float:'left',
            '&:after' : {
                content:'\' \'',
                display:'block',
                clear:'both'
            },
        },
        button : {
            pointer : 'default',
            float : 'left', width : '150px',
            padding : '10px',
            textAlign : 'center',
            borderRadius:'5px',
        },
        label : {
            float : 'left',
            width:'80px',

            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',

            borderBottom:'2px solid grey',
            padding : '12px 10px',
            textAlign : 'center',
        },
        icon : {
            float:'left'
        }
    }),
)

const Upload = ({name, icon=null, onUpload, defaultSrc = null, color = 'white'} : uploadInterface) => {
    const classes = useStyles()
    return (
        <div>
            <label htmlFor = {name} className={classes.labelBox}>
                <div className={classes.button} style={{backgroundColor : color}}>
                    <div className={classes.icon}>{icon}</div>
                    {`${name} Upload`}
                </div>
                <div className={classes.label}>{defaultSrc === null || typeof defaultSrc === 'undefined' || defaultSrc === '' ? '업로드' : defaultSrc}</div>
            </label>
            <input type='file' id={name} name={name} onChange={onUpload} style={{display:'none'}} multiple></input>
        </div>)
}

export default Upload