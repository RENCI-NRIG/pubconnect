import React, { useState } from 'react';
import { Link } from '@reach/router';
import '../App.css';
import PubConnectLarge from '../img/PC-large.png'
import { Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear'
import { Prizes } from '../components/prizes';
import PrizeLogo from '../img/prizes.png';

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
    sessionStorage.clear();
    const [usernames, setUserNames] = useState([""]);
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
        <div style={{ height: '100%', margin: 0 }}>
            <div className="login_wrap">
                <div className="logoBar"><a><img className="login_logo" src={PubConnectLarge}></img></a></div>
                <div className="form">
                    <div className="form-text">
                        <div>The survey should take about 10 minutes to complete and has two short parts:
                            <p className="form-bullet">1) We identify you in Microsoft Academic by whatever name(s) you have published under. </p>
                            <p className="form-bullet">2) Then we show you all the papers listed for you in Microsoft Academic and ask you to select the testbed(s) used in that research.</p>
                        </div>
                    </div>
                    <Typography>Enter your first and last name in the fields below.</Typography> <Typography>If you have published under more than one name, please click the + button to add those other names.</Typography>
                    <div className="form-action">
                        <div className="form-action-input">
                            {usernames.map((username, index) =>
                                <div key="index" className="login_namefield"><TextField variant="outlined" label="Name" fullWidth="true" className={classes.input} value={username} placeholder="John Doe" onChange={(e) => {
                                    let newArray = usernames.slice();
                                    newArray[index] = e.target.value;
                                    setUserNames(newArray);
                                }}></TextField>{index === 0 ? <span /> : <ToggleButton size="small" onClick={() => removeNameField(index)}><ClearIcon /></ToggleButton>}</div>)}</div>
                        <br />
                        <div><ToggleButton size="small" className="toggle_addName" onClick={addNameField}><AddIcon /></ToggleButton> Add another name you have published under</div>
                        <Link className="login_button" to="/home" state={{ userInfo: [usernames, email] }} > <Button fullWidth="true" variant="outlined" size="large" color="primary">Start Survey</Button></Link>
                    </div>
                </div >
                <br />
                <div className="prize-img-container">
                    <img className="prize-logo" src={PrizeLogo} />
                </div>
                <Typography>At the end of the survey you will have an opportunity to enter yourself in a raffle to win these prizes:</Typography>
                <Prizes />
            </div >
        </div>
    )
}

export default Login;