import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles } from '@material-ui/core';
import '../App.css';
import PubConnectSmall from '../PC-small.png';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        marginTop: 20
    },
    card: {
        backgroundColor: '#00758d',
        color: 'white'
    }
}))

function Submit(props) {
    const classes = useStyles();
    const userIDs = JSON.parse(sessionStorage.getItem('home'));
    sessionStorage.clear();

    return (
        <div className={classes.container}>
            <div className="logoBar"><a><img className="logo-small" src={PubConnectSmall}></img></a></div>
            <Card className={classes.card}><CardContent>Thank you so much for taking the time to complete this survey!
        <hr />
                <p><b>You are entered into the raffle!</b></p>
                <p>Participation Prize: The first 175 people to complete the survey will earn a  Sticker </p>
                <p>Second Prize: 6 participants will win a $25 Amazon gift card</p>
                <p>First Prize: 3 participants will win a $50 Amazon gift card</p>
                <p>Grand Prize: 10 participants will win the opportunity to be a  FABRIC beta tester</p>
                <p>Want to earn more opportunities to win? Check out your options <a href="https://gleam.io/">here</a>.</p>
            </CardContent></Card>
            <br />
            <Typography>We found {userIDs.length} names for you in Microsoft Academic. Visit <a href="https://www.microsoft.com/en-us/research/project/academic/articles/keep-your-profile-and-yourself-up-to-date/#:~:text=You%20may%20search%20for%20your,and%20selecting%20%E2%80%9CManage%20Claims.%E2%80%9D">this page</a> for more information on how to set-up your Microsoft Academic profile page: Keep your profile--and yourself--up to date.</Typography>
            { userIDs.map(id => <Typography>ID: {id[0]}</Typography>)}
            <br />
        </div>
    )
}

export default Submit;