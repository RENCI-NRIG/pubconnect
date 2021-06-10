import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles } from '@material-ui/core';
import '../App.css';
import { Prizes } from '../components/prizes';
import EnterPrizeLogo from '../entered.png'
import ThankYouLogo from '../thanks.png';
import PubConnectLarge from '../PC-large.png'

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
                <div>
                    <br />
                    <Typography>Here are the named entries we found for you in Microsoft Academic:</Typography>
                    <div className={classes.indented}>
                        <ul>
                            {Object.keys(renderNameID).map(name => <li>{name} (
                                {renderNameID[name].map((id, index) => <a href={`http://academic.microsoft.com/author/${id}`} target="_blank">{index > 0 ? ', ' : ''}{index + 1}</a>)}

                            )</li>)}
                        </ul>
                    </div>
                    <br />
                    <Typography>If you’d like to learn more about creating a profile page in Academic, here is a <a href="https://www.microsoft.com/en-us/research/project/academic/articles/keep-your-profile-and-yourself-up-to-date/#:~:text=You%20may%20search%20for%20your,and%20selecting%20%E2%80%9CManage%20Claims.%E2%80%9D" target="_blank">blog post</a> that shows you how.</Typography>
                </div>
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