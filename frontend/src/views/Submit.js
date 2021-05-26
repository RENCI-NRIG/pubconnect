import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles } from '@material-ui/core';
import '../App.css';
import { Prizes } from '../components/prizes';
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
    if(typeof value === 'object' && value !== null) {
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
    return (
        <div className="wrapper">
            <div className={classes.container}>
                <div className="logoBar"><a><img className="logo-small" src={PubConnectLarge}></img></a></div>
                <br />
                <div><h2 className={classes.heading}>Thank you so much for completing the survey!</h2>
                    <div>
                        <Typography>Here are the listings we found for you in Microsoft Academic:</Typography>
                        <br />
                        <div className={classes.indented}>
                            {userIDs.map(id => <Typography><a href={`http://academic.microsoft.com/author/${id[0]}`} target="_blank">{nameMap.get(id[0])}</a></Typography>)}
                        </div>
                        <br />
                        <Typography>If you’d like to learn more about creating a profile page in Academic, here is a <a href="https://www.microsoft.com/en-us/research/project/academic/articles/keep-your-profile-and-yourself-up-to-date/#:~:text=You%20may%20search%20for%20your,and%20selecting%20%E2%80%9CManage%20Claims.%E2%80%9D" target="_blank">blog post</a> that shows you how.</Typography>
                    </div>
                    <p><b>You are entered into the raffle!</b></p>
                    <div className={classes.indented}>
                        <Prizes />
                    </div>
                    <br />
                </div>
                <p className="submit-more">You can gain additional raffle tickets by completing other tasks such as referring  someone else to take the survey. Want to learn more? Then visit our <a href="https://gleam.io/" target="_blank">Gleam.io</a> page for other opportunities to win!
</p>
                <br />
            </div>
        </div>
    )
}

export default Submit;