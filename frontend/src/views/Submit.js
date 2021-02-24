import React, { useState } from 'react';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles } from '@material-ui/core';
import '../App.css';

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
    const userIDs = props.location.ids;
    return (
        <div className={classes.container}>
            <Card className={classes.card}><CardContent>Thank you so much for taking the time to complete this survey!
        <hr />
                <p>Prize:</p>
                <p>Participation Prize | Sticker (Chameleon, FABRIC, CloudLab?) | First 175 to complete the survey
                Postage</p>
                <p>Second Prize | $25 Amazon Gift Card | 6 Recipients selected by Gleam.io at random</p>
                <p>First Prize | $50 Amazon Gift Card | 3 Recipients selected by Gleam.io at random</p>
                <p>Grand Prize | FABRIC Beta Tester or Travel | 10 Recipients selected by Gleam.io at random</p>
            </CardContent></Card>
            <Button className={classes.btn} variant="outlined" color="secondary" size="large">Submit</Button>
            <br />
            <Typography>We found {userIDs.length} names for you in Microsoft Academic. Here are links to those pages:</Typography>
            { userIDs.map(id => <Typography>ID: {id}</Typography>)}
            <br />
            <span><Typography>If you would like to merge your X Microsoft Academic IDs into one…</Typography></span></div >
    )
}

export default Submit;