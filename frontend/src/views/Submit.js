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
                <p>Prize:</p>
                <p>Participation Prize | Sticker (Chameleon, FABRIC, CloudLab?) | First 175 to complete the survey
                Postage</p>
                <p>Second Prize | $25 Amazon Gift Card | 6 Recipients selected by Gleam.io at random</p>
                <p>First Prize | $50 Amazon Gift Card | 3 Recipients selected by Gleam.io at random</p>
                <p>Grand Prize | FABRIC Beta Tester or Travel | 10 Recipients selected by Gleam.io at random</p>
            </CardContent></Card>
            <br />
            <Typography>We found {userIDs.length} names for you in Microsoft Academic.</Typography>
            { userIDs.map(id => <Typography>ID: {id[0]}</Typography>)}
            <br />
        </div>
    )
}

export default Submit;