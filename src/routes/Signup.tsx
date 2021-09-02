import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import Link from "@material-ui/core/Link"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import React from "react"
import auth from "../component/Auth/auth"

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="https://material-ui.com/">
				HUB
			</Link>{" "}
			{new Date().getFullYear()}
			{". Built with "}
			<Link color="inherit" href="https://material-ui.com/">
				Hoseo University.
			</Link>
		</Typography>
	)
}
const useStyles = makeStyles(theme => ({
	"@global": {
		body: {
			backgroundColor: theme.palette.common.white
		}
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}))
const onSubmit = e => {
	e.preventDefault()
	const data = {
		id : e.target.id.value,
		pwd : e.target.password.value
	}
	auth.login(data)
}
export default function SignIn(props) {
	const classes = useStyles()
	if(auth.isAuthenticated()) props.history.push('/')
	return (
		
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate onSubmit={onSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="id"
						label="ID"
						name="id"
						autoComplete="id"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						
					>Sign In</Button>
				</form>
			</div>
			<Box mt={8}> <Copyright /> </Box>
		</Container>
	)
}
