import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import '../../style/font.css';
import Auth from '../Auth/auth';
import Dialog from '../Dialog';
import "./Nav.css";


//const useStyles = makeStyles({ list: { width: 250 } });
const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  drawer: {
    position:'relative',
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX:'hidden',
    backgroundColor:'#2c537a',
    "&::-webkit-scrollbar" : {
      display:'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    marginTop:'20px',
    backgroundColor:'#2c537a',
    zIndex:12,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const navList = [
  {name : "공지관리", path : '/notice'},
    {name : "통학버스", path : [
      {name : "노선관리", path : "/busline"},
      {name : "버스위치", path : "/buslocation"},
      {name : "버스일정", path : "/busschedule"},
      {name : "티켓관리", path : "/ticket"},
    ]},
    {name : "셔틀버스", path : [
      {name : "노선관리", path : "/shuttleline"},
      {name : "시간표관리", path : "/shuttle"},
      {name : "버스위치", path : "/shuttlelocation"},
      {name : "페이백관리", path : "/payback"},
      {name : "QR기록", path : "/qrlog"},
    ]},
    {name : "정류장관리", path : "/stoplist"},
    {name : "버스위치기록", path : "/buslog"},
    {name : "단말기관리", path : "terminal"},
    {name : "사용자관리", path : '/usermanage'},
]

const CopyrightInfo = (props) => {
  const {open, onClose} = props
  return (
    <Dialog
      title='Copyright'
      type='component'
      defaultState={open}
      onClose={onClose}>
      <div style = {{
        margin : '1.5rem',
        lineHeight: '1.5rem',
        padding : '1.2rem',
        backgroundColor:'#eee',
        borderRadius:'5px',
      }}>
        Copyright © 2020 UCK<br/>
        Copyright © 2020 Material-UI<br/>
        Copyright © 2020 icon-icons.com<br/>
        Copyright © 2010-2020 Freepik Company S.L<br/>
      </div>
    </Dialog>
  )
}

const tockenItem = (arr, idx) => {
  const cpArr = arr.slice()
  return cpArr.map((open, i) => 
    (idx === i) ? !open : false
  )
}

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState([])

	return(
		<div>
			<Drawer //Drawer navigation component
				className={classes.drawer}
				variant="permanent"
				classes={{paper: classes.drawerPaper,}}
				anchor="left">
        <div className='MuiList-script'>
          <div className='MuiList-main script'>HUB</div>
          <div className='MuiList-sub script'>{sessionStorage.getItem('company')}</div> 
          {/* 사용자 회사명 표시 */}
          <div className='MuiList-sub script'>{sessionStorage.getItem('name')}</div>
          {/* 사용자 이름 표시 */}
          {Auth.isAuthenticated() ? 
            <Button variant="contained" className='script' onClick={Auth.logout}>Logout</Button> : 
            <Link to='/login'><Button variant="contained" className='script'>Login</Button></Link>}
          {Auth.isAdmin() ? 
            <div className='nav-link'><Link to='/regist'><Button variant="none">계정생성</Button></Link></div>
             : null}
        </div>
				
				<div className={classes.toolbar}> 
				<List>
				{navList.map((item, idx) => {
          const haveSubMenu = typeof(item.path) === 'object'  //하위 메뉴 존재 확인
          if(haveSubMenu) drop.push(false)  //만약 하위메뉴가 있다면 drop 상태 관리에 push
          const inner_component = ( //리스트 아이템 정의
            <ListItem 
              className="item" key={item.name} 
              onClick = {haveSubMenu ? ()=>setDrop(tockenItem(drop, idx)) : null}>
            <ListItemText primary={item.name} />
              {haveSubMenu ? ( drop[idx] ? 
                <ExpandLess onClick={()=>setDrop(tockenItem(drop, idx))}/> : 
                <ExpandMore onClick={()=>setDrop(tockenItem(drop, idx))}/> ) : null}
            </ListItem>
          )

          const item_component = [  //item (클릭그룹) 정의
            (haveSubMenu) ? inner_component : 
            <NavLink exact to={item.path} activeClassName="active" key={idx}>
              {inner_component}
            </NavLink>]

          if(haveSubMenu) {
            item_component.push(
              <Collapse in={drop[idx]} timeout="auto" unmountOnExit key={item.name + idx}>
                {item.path.map((sub, idx2) => (
                  <NavLink exact to={sub.path} activeClassName="active" key={idx2}>
                    <ListItem className="item sub-item" key={sub.name}>
                      <ListItemText primary={sub.name} />
                    </ListItem>
                  </NavLink>
                ))}
              </Collapse>
            )
          }
          return item_component //완성된 메뉴 컴포넌트 리턴
        })}
				</List>
      </div>
        <div className='copyright' onClick={()=>setOpen(true)}>
          Copyright © 2020 UCK <br/><br/>Click more information
        </div>
			</Drawer>
      <CopyrightInfo 
        open={open}
        onClose={()=>setOpen(false)}
        />
		</div>
  )
}
