import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import React, { useEffect, useState } from "react"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            border:'1px solid black',
            width: 400,
            margin:'10px auto',
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            margin:'10px auto'
        },
    }),
)

export default function CustomizedInputBase(props) {    //UserManage에서 사용되는 검색컴포넌트
    const classes = useStyles()
    const [text, setText] = useState<string>('')
    const { onSearch=()=>{} } = props

    useEffect(()=>{}, [])

    return (
        <div>
            <Paper component="form" className={classes.root}>
                <IconButton className={classes.iconButton} aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder="학번을 입력하시오"
                    inputProps={{ 'aria-label': 'search student id' }}
                    onChange={(e) => setText(e.target.value)}/>
                <IconButton 
                    type="submit" 
                    className={classes.iconButton} 
                    aria-label="search"
                    onClick={(e) => {
                        e.preventDefault()
                        onSearch(text)
                    }}>
                    <SearchIcon />
                </IconButton>
            </Paper>
            
        </div>
    )
}