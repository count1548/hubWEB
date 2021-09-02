import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from './component/Auth/auth';
import ProtectedRoute from "./component/Auth/protected.route";
import Nav from "./component/Nav/Nav";
import BusLine from "./routes/Bus/BusLine";
import BusLocation from "./routes/Bus/BusLocation";
import BusSchedule from './routes/Bus/BusSchedule';
import BusLog from './routes/BusLog';
import Notice from "./routes/Notice";
import Regist from './routes/Regist';
import Payback from "./routes/Shuttle/Payback";
import QRLog from "./routes/Shuttle/QRLog";
import ShuttleLine from "./routes/Shuttle/ShuttleLine";
import ShuttleLocation from "./routes/Shuttle/ShuttleLocation";
import ShuttleSchedule from "./routes/Shuttle/ShuttleSchedule";
import StopList from "./routes/StopList";
import Terminal from "./routes/Terminal";
import Ticket from "./routes/Ticket";
import Login from "./routes/UserManage/Login";
import UserManage from './routes/UserManage/UserManage';
import UserShuttlePage from "./routes/UserShuttlePage";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	  },
	content: {
		flexGrow: 1,
		width : '95%',
		margin:'0 auto',
		minWidth:'1000px',
		padding: '30px',
	},
  }));

const App = () => {
	const classes = useStyles()
	return ( <Router> <div className={classes.root}>
		{Auth.isAuthenticated() ? <Nav/> : null}
		<div className={classes.content}>
			<Switch >
				<Route exact path="/login" component={Login} />	
				<Route exact path="/user/shuttle" component={UserShuttlePage} />	
				<ProtectedRoute exact path="/" component={BusSchedule} />
				<ProtectedRoute exact path="/busline" component={BusLine} />
				<ProtectedRoute exact path="/busschedule" component={BusSchedule} />
				<ProtectedRoute exact path="/stoplist" component={StopList} />
				<ProtectedRoute exact path="/buslocation" component={BusLocation} />

				<ProtectedRoute exact path="/shuttle" component={ShuttleSchedule} />
				<ProtectedRoute exact path="/shuttlelocation" component={ShuttleLocation} />
				<ProtectedRoute exact path="/shuttleline" component={ShuttleLine} />
				<ProtectedRoute exact path="/qrlog" component={QRLog} />
				<ProtectedRoute exact path="/qrlog/:id" component={QRLog} />
				<ProtectedRoute exact path="/payback" component={Payback} />
				<ProtectedRoute exact path="/buslog" component={BusLog} />
				
                <ProtectedRoute exact path="/ticket" component={Ticket} />
				<ProtectedRoute exact path="/terminal" component={Terminal} />
				<ProtectedRoute exact path="/usermanage" component={UserManage} />
				<ProtectedRoute exact path="/notice" component={Notice} />

				<ProtectedRoute exact path="/regist" component={Regist} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
