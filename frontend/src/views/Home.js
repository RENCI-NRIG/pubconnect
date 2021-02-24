import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Link } from 'react-router-dom';
import '../App.css';

import { Button, Card, CardContent, Checkbox, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2)
    },
    link_button: {
        margin: theme.spacing(2),
        textDecoration: 'none'
    }
}))

function Home(props) {
    let counter = 0;
    const userInfo = props.location.userInfo[0];
    const classes = useStyles();
    const [isLoading, setLoading] = useState(true);
    const [authorIDArray, setAuthorIDArray] = useState([]);
    const [authorArticle, setAuthorArticle] = useState([]);
    const [checkedArray, setCheckArray] = useState([]);

    function capitalizeFirstLetter(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    function capitalizeAuthorName(s) {
        s = capitalizeFirstLetter(s)
        return s.replaceAll(/ [a-z]/g, z => z.toUpperCase());
    }

    useEffect(async () => {
        let tem = [];
        for await (let i of userInfo) {
            console.log(i)
            axios({
                method: 'GET',
                url: 'https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate',
                params: {
                    expr: `Composite(AA.AuN=='${i}')`,
                    attributes: 'AA.AuId,AA.AuN',
                    'subscription-key': 'f6714001211242e982d92a3646ececed',
                    count: 100
                }
            }).then(res => {
                let ids = new Set();
                for (let article in res.data.entities) {
                    for (let author in res.data.entities[article].AA) {
                        if (res.data.entities[article].AA[author].AuN == i) {
                            ids.add(res.data.entities[article].AA[author].AuId);
                        }
                    }
                }
                tem.push(Array.from(ids));
                // tem = [...tem, ...Array.from(ids)];
                if (tem.length == userInfo.length) {
                    let newArray = Array.prototype.concat.apply([], tem);
                    newArray.sort();
                    setAuthorIDArray(newArray);
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [userInfo])

    useEffect(async () => {
        let tem = [];
        let visited = [];
        for (let index in authorIDArray) {
            const currentAuthorID = authorIDArray[index];
            const result = await axios({
                method: 'GET',
                url: 'https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate',
                params: {
                    expr: `Composite(AA.AuId=${currentAuthorID})`,
                    attributes: 'AA.AuId,AA.AuN,Ti,VFN,Y,CC',
                    'subscription-key': 'f6714001211242e982d92a3646ececed',
                    count: 1000
                }
            }).then(res => {
                if (res.data.entities.length !== 0) {
                    let oldObj = res.data.entities;
                    oldObj[0].Ti = capitalizeFirstLetter(oldObj[0].Ti);
                    tem.push([currentAuthorID, res.data.entities]);
                }
                visited.push("1");
                if (visited.length == authorIDArray.length) {
                    setAuthorArticle(authorArticle.concat(tem));
                    console.log(tem);
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [authorIDArray])

    const handleCheckBox = props => {
        console.log(checkedArray);
        let index = checkedArray.indexOf(props);
        if (index !== -1) {
            let newArray = [...checkedArray];
            newArray.splice(index, 1);
            setCheckArray(newArray);
            console.log(newArray)
        }
        else {
            let newArray = [...checkedArray, props];
            setCheckArray(newArray);
            console.log(newArray)
        }
    }

    const renderAuthorList = authors => {
        let authorList = "";
        for (let id in authors) {
            if (authorList !== '') authorList += ", "
            authorList += capitalizeAuthorName(authors[id].AuN)
        }
        return authorList;
    }

    return (
        <div class="container">
            <Typography><Link to={{ pathname: '/login' }}><Button><ArrowBackIcon /></Button></Link></Typography>
            <div className="home_text"><p>Based on the name(s) and email address you provided, we have found <b>{authorArticle.length}</b> possible authors listed in Microsoft Academic that could be you. Please select those papers below that are, in fact, authored by you.</p>

            <p> Once you complete this step, we confirm which Microsoft Academic IDs are yours and then we will show you a listing of all the papers listed in Microsoft Academic that you have written since 2011.</p>

            <i>At the end of the survey, we will provide you with a link(s) to your paper listings in Microsoft Academic. If you have more than one listing because Microsoft Academic shows more than one name for you, we will provide you with some brief instructions on how to merge your identities in Microsoft Academic if you would like to do so.</i>
</div>
            {authorArticle.map(this_author => <Card className={classes.card}>
                <CardContent><Checkbox onClick={() => { handleCheckBox(this_author[0]) }}></Checkbox>
                    <Typography>{renderAuthorList(this_author[1][0].AA)}</Typography><Typography>{this_author[1][0].Ti}</Typography><Typography>{this_author[1][0].VFN == undefined ? "" : this_author[1][0].VFN + ", "}{this_author[1][0].Y}</Typography></CardContent>
            </Card>)}
            <Link className={classes.link_button} to={{ pathname: "/verify", userInfo: checkedArray, prevData: props.location.userInfo }}><Button fullWidth variant="outlined" color="primary">Continue</Button></Link>

        </div>
    )
}

export default Home;