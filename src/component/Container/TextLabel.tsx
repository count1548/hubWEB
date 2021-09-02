import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from "react"

const useStyles = makeStyles(() =>
  createStyles({
    root : {
        lineHeight:'3em',
    },
    header : {
        display : 'inline-block',
        borderLeft : '10px solid #bbb',
        paddingLeft : '8px',
        verticalAlign:'top',
        width : '40%',
    },
    content : {
        width : 'calc(60% - 18px)',
        display : 'inline-block',
        color : 'grey'
    },
  }),
)

export default function TextLabel ({    //텍스트 좌측 라벨 표시
    label, children
}) {
    const classes = useStyles()
    if(children === null || children === '') children = '정보없음'
    return (
        <div className={classes.root}>
            <span className={classes.header}>{label}</span>
            <span className={classes.content}>{children}</span>
        </div>
    )
}
