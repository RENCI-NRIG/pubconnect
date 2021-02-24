import React, { useState } from 'react';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column'
    }
}))

function Submit(props) {
    const classes = useStyles();
    const userIDs = props.location.ids;
    return (
        <Container className={classes.container}>
            <Card><CardContent>Thank you so much for taking the time to complete this survey! </CardContent></Card>

        <p>Prize</p>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

        <Button variant="outlined" color="secondary">Submit</Button>
        <br />
        <Typography>We found {userIDs.length} names for you in Microsoft Academic. Here are links to those pages:</Typography>
            {userIDs.map(id => <Typography>ID: {id}</Typography>)}
        <br/>
        <span><Typography>If you would like to merge your X Microsoft Academic IDs into one…</Typography></span></Container>
    )
}

export default Submit;