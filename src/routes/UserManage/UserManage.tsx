/*eslint-disable*/
import Loading from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useEffect, useState } from "react"
import CardLayout from '../../component/CardLayout'
import Container from '../../component/Container'
import TextLabel from '../../component/Container/TextLabel'
import SearchBox from '../../component/Search'
import NoData from '../../component/Table/NoData'
import { getAPI, setAPI } from '../../data_function'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainContent : {
            width : 'clac(100% - 60px)',
            padding : '30px',
            borderRadius : '5px',
            background : '#ccc',
            '&:after' : {
                content : '\' \'',
                display : 'block',
                clear : 'both'
            }
        },
        divider: {
            margin:'60px auto'
        },
        button : {
            display:'block',
            margin:'10px auto'
        },
        pageTitle : {
            color : '#2c537a',
            width : '100%',
            height : '32px',
            position : 'relative',
            fontSize : '24px',
            textAlign : 'center',
            fontFamily : 'NanumSquareRoundEB',
            fontWeight : 'bold',
            marginBottom : '20px',
        }
    }),
)
let studentsData:any[] = []

const UserInfo = (props) => {
    const [studentID, setStudentID] = useState<string>('')
    const [studentData, setStudentData] = useState<null | Object>(null)
    const [updated, setUpdated] = useState(true)
    const [state, setState] = useState('apply')

    const classes = useStyles()
    useEffect(() => {
        getAPI(`user/all?sid=${studentID}`).then(res => {
            studentsData = res
            if(studentID !== '') {
                const student = studentsData.find(student => student['STUDENT_ID'] === studentID)
                if(typeof student !== 'undefined') setStudentData(student)
                else setStudentData(null) 
            }
            setState('show')
        })
    }, [updated])

    if(state === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>
   
    return (
        <div>
            <div className={classes.pageTitle}>사용자 관리</div>
            <SearchBox
                onSearch={value => {
                    setStudentID(value)
                    const student = studentsData.find(student => student['STUDENT_ID'] === value)
                    if(typeof student !== 'undefined') setStudentData(student)
                    else setStudentData(null) 
                }}
            /> 
            <Divider className={classes.divider}/>
            {(studentsData.length === 0) ? <NoData message='Please Input Student ID' /> :
                (studentData === null) ? <NoData message='Please Input Valid Student ID' /> :
            <div className={classes.mainContent}>
                <Container 
                    title={'학생정보'}
                    width={'45%'}
                    align={'left'} >
                    <TextLabel label={'학번'}>{studentID}</TextLabel>   
                    <TextLabel label={'이름'}>{studentData['STUDENT_NAME']}</TextLabel>
                    <TextLabel label={'소속학과'}>{studentData['STUDENT_DEPT']}</TextLabel>
                    <TextLabel label={'개인정보 동의여부'}>{studentData['ACCEPT']}</TextLabel>
                    <TextLabel label={'전화번호'}>{studentData['PHONE']}</TextLabel>
                    <TextLabel label={'주소'}>{studentData['ADDRESS']}</TextLabel>
                    <Divider className={classes.divider} style={{margin:'10px auto'}}/>
                    <TextLabel label={'페널티 횟수'}>{studentData['PENALTY_COUNT']}</TextLabel>
                    <TextLabel label={'패널티 시작'}>{studentData['PENALTY_DATE']}</TextLabel>
                    <TextLabel label={'패널티 종료'}>{studentData['PENALTY_END']}</TextLabel>
                </Container>

                <Container 
                    title={'등록카드'}
                    width={'45%'}
                    align={'right'} >
                    <CardLayout 
                        name={studentData['STUDENT_NAME']} 
                        card_number={studentData['CARD_NUM']}
                        onSubmit={(value) => {
                            setState('apply')
                            setAPI('check/card/create', {
                                STUDENT_ID : studentID,
                                CARD_NUM : value
                            }).then(res => setUpdated(!updated))
                        }}
                        onReset={() => {
                            setState('apply')
                            setAPI('check/card/delete', { STUDENT_ID : studentID}).then(res => setUpdated(!updated))
                        }}
                    />
                </Container>
            </div>}
        </div>
    )
}
export default UserInfo
