import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReplayIcon from '@material-ui/icons/Replay';
import PubConnectSmall from '../PC-small.png';
import { Link } from '@reach/router';
import '../App.css';

import { Button, Card, CardContent, Checkbox, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2),
        backgroundColor: '#d9d9d9'
    },
    link_button: {
        margin: theme.spacing(2),
        textDecoration: 'none'
    }
}))

function Home(props) {
    let userInfo;
    if (sessionStorage.getItem('login') === null) {
        userInfo = props.location.state.userInfo;
        sessionStorage.setItem('login', JSON.stringify(userInfo))
    }
    else {
        userInfo = JSON.parse(sessionStorage.getItem('login'))
    }
    let counter = 0;
    const classes = useStyles();
    const [isLoading, setLoading] = useState(true);
    const [authorIDArray, setAuthorIDArray] = useState([]);
    const [authorArticle, setAuthorArticle] = useState([]);
    const [checkedArray, setCheckArray] = useState(sessionStorage.getItem('home') === null ? [] : JSON.parse(sessionStorage.getItem('home')));

    function capitalizeFirstLetter(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    function capitalizeAuthorName(s) {
        s = capitalizeFirstLetter(s)
        return s.replaceAll(/ [a-z]/g, z => z.toUpperCase());
    }

    function findAfN(author_lists, author_id) {
        for (let i = 0; i < author_lists.length; i++) {
            let curr_author = author_lists[i];
            if (curr_author['AuId'] === author_id) {
                return curr_author['AfN'];
            }
        }
    }

    useEffect(async () => {
        let tem = [];
        for await (let i of userInfo[0]) {
            let lowerCaseName = i.toLowerCase();
            axios({
                method: 'GET',
                url: 'https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate',
                params: {
                    expr: `Composite(AA.AuN=='${lowerCaseName}')`,
                    attributes: 'AA.AuId,AA.AuN',
                    'subscription-key': 'f6714001211242e982d92a3646ececed',
                    count: 100
                }
            }).then(res => {
                let ids = new Set();
                for (let article in res.data.entities) {
                    for (let author in res.data.entities[article].AA) {
                        if (res.data.entities[article].AA[author].AuN == lowerCaseName) {
                            ids.add(res.data.entities[article].AA[author].AuId);
                        }
                    }
                }
                tem.push(Array.from(ids));
                if (tem.length == userInfo.length) {
                    let newArray = Array.prototype.concat.apply([], tem);
                    newArray.sort();
                    setAuthorIDArray(newArray);
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [])

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
                    attributes: 'AA.AuId,AA.AfN,AA.AuN,DOI,Id,Ti,VFN,Y,CC',
                    'subscription-key': 'f6714001211242e982d92a3646ececed',
                    count: 1000
                }
            }).then(res => {
                if (res.data.entities.length !== 0) {
                    tem.push([currentAuthorID, findAfN(res.data.entities[0]['AA'], currentAuthorID), res.data.entities[0]]);
                }
                visited.push("1");
                if (visited.length == authorIDArray.length) {
                    setAuthorArticle(authorArticle.concat(tem));
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [authorIDArray])

    const checkIfInArray = (array, item) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] === item[0] && array[i][1] === item[1]) {
                return i;
            }
        }
        return -1;
    } 

    const handleCheckBox = props => {
        let index = checkIfInArray(checkedArray, props);
        if (index !== -1) {
            let newArray = [...checkedArray];
            newArray.splice(index, 1);
            setCheckArray(newArray);
        }
        else {
            let newArray = [...checkedArray, props];
            setCheckArray(newArray);
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
            <div className="logoBar"><a><img className="logo-small" src={PubConnectSmall}></img></a></div>
            <Typography><Link className="clean-button" to='/'><Button variant="outlined" color="primary" onClick={() => sessionStorage.clear()}><ReplayIcon />Start Over</Button></Link></Typography>
            <div className="home_text"><p>Based on the name(s) and email address you provided, we have found <b>{authorArticle.length}</b> possible authors listed in Microsoft Academic that could be you. Please select those papers below that are, in fact, authored by you.</p>

                <p> Once you complete this step, we confirm which Microsoft Academic IDs are yours and then we will show you a listing of all the papers listed in Microsoft Academic that you have written since 2011.</p>

                <i>At the end of the survey, we will provide you with a link(s) to your paper listings in Microsoft Academic. If you have more than one listing because Microsoft Academic shows more than one name for you, we will provide you with some brief instructions on how to merge your identities in Microsoft Academic if you would like to do so.</i>
            </div>
            {authorArticle.map(this_author => <Card className={classes.card}>
                <CardContent><Checkbox checked={checkIfInArray(checkedArray, this_author) !== -1} onClick={() => { handleCheckBox(this_author) }}></Checkbox>
                    <Typography>{renderAuthorList(this_author[2].AA)}</Typography><Typography>{this_author[2].Ti}</Typography><Typography>{this_author[2].VFN == undefined ? "" : this_author[2].VFN + ", "}{this_author[2].Y}</Typography></CardContent>
            </Card>)}
            <Link className={classes.link_button} to="/verify" state={{ checkedArray: checkedArray, userInfo: userInfo }}><Button fullWidth variant="outlined" color="primary">Continue</Button></Link>

        </div>
    )
}

export default Home;