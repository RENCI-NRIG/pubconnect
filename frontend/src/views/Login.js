import React, { useState } from 'react';
import { Link } from '@reach/router';
import '../App.css';
import PubConnectLarge from '../PC-large.png'

import { Button, Heading, TextField, Typography } from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import ToggleButton from '@material-ui/lab/ToggleButton';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles((theme) => ({
    input: {
        margin: theme.spacing(1)
    },
    card: {
        backgroundColor: '#00758d',
        color: 'white',
        fontSize: 16
    }
}))

function Login() {
    const [usernames, setUserNames] = useState(sessionStorage.getItem('login') === null ? ["", ""] : JSON.parse(sessionStorage.getItem('login')));
    const [namesCounter, setNamesCounter] = useState([0]);
    const [email, setEmail] = useState();
    const classes = useStyles();

    const addNameField = () => {
        setNamesCounter([...namesCounter, namesCounter.length]);
        setUserNames([...usernames, ""]);
    }

    const removeNameField = (index) => {
        let removedArray = usernames.slice();
        removedArray.splice(index, 1);
        setUserNames(removedArray);
    }

    return (
        <div className="login_body">
            <div className="login_wrap">
                <div className="logoBar"><a><img className="login_logo" src={PubConnectLarge}></img></a></div>
                <div className="form">
                    <Card className={classes.card}>
                        <CardContent>
                            <p>Thank you for participating in our PubConnect Testbed Survey! We suggest you complete the survey in one sitting because you may not be able to save your progress if you return at a later time.</p>
                            <p><b>How the Survey Works</b> - The survey should take about 10 minutes to complete and has two short parts: We identify you in Microsoft Academic by whatever name(s) you have published under. We show a list of papers that you have written since 2011*; you select the testbed(s) used in the research that led you to write the paper.</p>
                            <p>*The year the first of these testbeds were introduced.</p>
                            <hr />
                            <p><b>Thank you!</b> -
                            By completing the survey, we would like to offer you a token of our appreciation! You will automatically be entered into a raffle to win Amazon gift cards and the opportunity to be a <a href="https://www.whatisfabric.net/">FABRIC beta tester</a>, and If you are listed multiple times in Microsoft Academic, we give you the opportunity to combine the names you’ve published under into a single Microsoft Academic listing at the end of the survey.</p>
                        </CardContent>
                    </Card>
                    <p><b>Getting Started</b> -
                Please first enter your email address,* and full name in the fields below. If you have published under more than one name, please click the + button to add those other names.</p>
                    <div id="username_group">
                        <div className="login_namefield"><TextField variant="outlined" className={classes.input} label="Email" fullWidth="true" placeholder="john.doe@gmail.com" onChange={(e) => { setEmail(e.target.value) }}></TextField></div>
                        {usernames.map((username, index) =>
                            <div key="index" className="login_namefield"><TextField variant="outlined" label="First Last Name" fullWidth="true" className={classes.input} value={username} placeholder="John Doe" onChange={(e) => {
                                let newArray = usernames.slice();
                                newArray[index] = e.target.value;
                                setUserNames(newArray);
                            }}></TextField>{index === 0 ? <span /> : <ToggleButton size="small" onClick={() => removeNameField(index)}><ClearIcon /></ToggleButton>}</div>)}
                        <br />
                        <div><ToggleButton size="small" className="toggle_addName" onClick={addNameField}><AddIcon /></ToggleButton> Add another name you have published under</div>
                        <br />
                        <Link className="login_button" to="/home" state={{ userInfo: [usernames, email] }} > <Button fullWidth="true" variant="outlined" size="large" color="primary">Start Survey</Button></Link>
                    </div>
                </div >
            </div>
            <footer className="login_footer">* Your email address will not be shared beyond the members of the group conducting the survey (i.e., Ilya Baldin, Paul Ruth, Brittany Todd, Bo Zhou, and Laura Christopherson at RENCI, UNC-Chapel Hill). We are asking for it
            in case it is helpful in identifying you in Microsoft Academic,
            in case you are interested in using or testing publication tracking app once it is ready,
            and to contact you if you win the raffles.
                No other personal information about you will be asked in the course of this survey.</footer>
        </div>
    )
}

export default Login;