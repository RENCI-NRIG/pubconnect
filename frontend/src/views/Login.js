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
                            <p>Thank you for participating in our PubConnect Testbed Survey!</p>

                            <p><b>Survey Goals</b> - We are conducting this survey to learn more about published papers that benefitted in some way from use of the GENI, Chameleon, or CloudLab testbeds, so we can report the impact these testbeds have had on the research community to the National Science Foundation (NSF)--the funding agency that supports the work on these testbeds, and
                to inform the design of an application that will help authors and testbed developers track publications that reference the use of a testbed.</p>

                            <p><b>How the Survey Results will be Used</b> -
                As stated above, we will use the citations to report on the testbeds’ impact to NSF.
                We may also list the citations on the testbeds’ websites. For instance, GENI papers are listed on the GENI website.</p>

                            <p><b>How the Survey Works</b> -
                We begin by trying to identify you in Microsoft Academic by whatever name(s) you have published under. Then we will show you a list of papers you have written since 2011--when the first of these testbeds was introduced--and ask you to select the testbed(s) that were used in the research that led you to write the paper.</p>
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