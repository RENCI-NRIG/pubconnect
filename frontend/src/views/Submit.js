import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { NotFound } from './NotFound';
import '../App.css';
import { Prizes } from '../components/prizes';
import EnterPrizeLogo from '../img/entered.png'
import ThankYouLogo from '../img/thanks.png';
import PubConnectLarge from '../img/PC-large.png'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '800px'
    },
    btn: {
        marginTop: 20
    },
    heading: {
        textAlign: 'center'
    },
    indented: {
        padding: '0 20px'
    }
}))

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function Submit(props) {
    const classes = useStyles();
    const userIDs = JSON.parse(sessionStorage.getItem('home'));
    const userName = JSON.parse(sessionStorage.getItem('login'));
    const nameMap = JSON.parse(sessionStorage.getItem('nameMap'), reviver);
    
    if(userIDs === null) return <NotFound />

    let renderNameID = {};
    userIDs.forEach(id => {
        if (!(nameMap.get(id[0]) in renderNameID)) {
            let newIDList = [];
            newIDList.push(id[0])
            renderNameID[nameMap.get(id[0])] = newIDList;
        }
        else {
            let oldIDList = renderNameID[nameMap.get(id[0])];
            oldIDList.push(id[0]);
        }
    });

    return (
        <div className="wrapper">
            <div className={classes.container}>
                <div className="logoBar"><a><img className="logo-small" src={PubConnectLarge}></img></a></div>
                <br />
                <img className="submit-thank-logo" src={ThankYouLogo} />
                <img className="submit-entered-logo" src={EnterPrizeLogo} />
                <div className={classes.indented}>
                    <Prizes />
                </div>
                <br />
                <Typography>
                    You can gain additional raffle tickets by completing other tasks such as referring someone else to take the survey. Want to learn more? Then visit our <a href="https://gleam.io/" target="_blank">Gleam.io</a> page for other opportunities to win!
                </Typography>
                <br />
            </div>
        </div>
    )
}

export default Submit;