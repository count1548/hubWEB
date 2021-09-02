import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ImageIcon from '@material-ui/icons/Image';
import React, { useState } from 'react';
import Dialog from '../Dialog';
import Upload from '../Upload';

const useStyles = makeStyles(() => ({
    header : {
        fontSize:'24px',
        marginBottom:'20px',
        fontFamily:'NanumSquareRoundEB',
        fontWeight: 'bold',
        color:'#2c537a',
        textAlign:'center'
    },
    button : {
        display:'block',
        float:'right', width:'100px',
        padding : '10px', margin:'10px 0',
    }, 
    container : {
        display:'block',
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both'
        }
    }
}));

const Notice = props => {   //공지 편집 컴포넌트
    const classes = useStyles()
    const [required, setRequired] = useState(false) //필수입력검증
    const [notice, setNotice] = useState({...props})//기존 공지 데이터
    const {imageE = true, fileE = true} = props

    const {onSubmit} = props

    const onFileSet = (ev, target) => {
        setNotice({
            ...notice,
            [target] : ev.target.files[0],
            [`${target}_SRC`] : ev.target.files[0]['name']
        })
		ev.target.value = null
    }
    
    const onClick = () => {
        if(notice['TITLE'] === '' || notice['CONTENT'] === '') {
            setRequired(true)
            return
        }
        const formData = new FormData()
        for ( var key in notice )
            formData.append(key, notice[key])
        onSubmit(formData)
    }

    return (
        <div>
            {/* <CKEditor
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log("Editor is ready to use!", editor);
                    editor.editing.view.change(writer => {
                        writer.setStyle(
                        "height",
                        "400px",
                        editor.editing.view.document.getRoot()
                        );
                    });
                }}
                editor={ClassicEditor}
                data={notice['CONTENT']}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                    setNotice({...notice, CONTENT : data})
                }}
            ></CKEditor> */}
            <TextField
                id="filled-multiline-static"
                fullWidth
                label="제목"
                value={notice['TITLE']}
                onChange={value => {
                    setNotice({...notice, TITLE : value.target.value})
                }}
                variant="outlined"/>
            <TextField
                id="filled-multiline-static"
                multiline
                rows={15}
                label="내용"
                fullWidth
                value={notice['CONTENT']}
                onChange={value => {
                    setNotice({...notice, CONTENT : value.target.value})
                }}
                style={{margin:'30px auto'}}
                variant="outlined"
            />
            <div className = {classes.container}>
                <div style={{
                    width : '540px',
                    float : 'left',
                    margin:'10px 0',
                }}>
                    {fileE && <Upload 
                        name='FILE' 
                        icon={<AttachFileIcon/>}
                        color = 'powderblue'
                        defaultSrc={notice['FILE_SRC']}
                        onUpload={ev => onFileSet(ev, 'FILE')}/>}
                    {imageE && <Upload 
                        name='IMAGE' 
                        icon={<ImageIcon/>}
                        color = 'powderblue'
                        defaultSrc={notice['IMAGE_SRC']}
                        onUpload={ev => onFileSet(ev, 'IMAGE')}/>}
                </div>
                <Button 
                    variant="contained" 
                    color='primary' 
                    onClick={onClick}
                    className={classes.button}
                    >글쓰기</Button>
            </div>
            <Dialog
                children={'필수 항목을 입력하십시오'}
                onClose = {()=>setRequired(false)}
                reset={false}
                defaultState={required}
            />
        </div>
    )
}

export default Notice