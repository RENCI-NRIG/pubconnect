import React, { Fragment, useState, useEffect } from 'react';
import { NotFound } from './NotFound';
import axios from 'axios';
import ReplayIcon from '@material-ui/icons/Replay';
import PubConnectLarge from '../img/PC-large.png';
import { Link, navigate } from '@reach/router';
import '../App.css';

import { Button, Card, CardContent, Checkbox, CircularProgress, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(2),
        backgroundColor: '#d9d9d9',
        width: '50%',
        cursor: 'pointer'
    },
    link_button: {
        margin: theme.spacing(2),
        textDecoration: 'none',
        width: '8vw'
    }
}))

function Home(props) {
    let userInfo;
    const classes = useStyles();
    const [nameMap, setNameMap] = useState();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [authorIDArray, setAuthorIDArray] = useState([]);
    const [authorArticle, setAuthorArticle] = useState([]);
    const [checkedArray, setCheckArray] = useState(sessionStorage.getItem('home') === null ? [] : JSON.parse(sessionStorage.getItem('home')));

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
        setLoading(true)
        let tem = [];
        let tem_NameMap = new Map();
        if (userInfo !== undefined) {
            for await (let i of userInfo[0]) {
                let lowerCaseName = i.toLowerCase();
                axios({
                    method: 'GET',
                    url: 'https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate',
                    params: {
                        expr: `Composite(AA.AuN=='${lowerCaseName}')`,
                        attributes: 'AA.AuId,AA.AuN,AA.DAuN',
                        'subscription-key': 'f6714001211242e982d92a3646ececed',
                        count: 100
                    }
                }).then(res => {
                    let ids = new Set();
                    if (res.data.entities.length === 0) {
                        setLoading(false);
                        setError(true);
                    }
                    else {
                        for (let article in res.data.entities) {
                            for (let author in res.data.entities[article].AA) {
                                if (res.data.entities[article].AA[author].AuN == lowerCaseName) {
                                    ids.add(res.data.entities[article].AA[author].AuId);
                                    tem_NameMap.set(res.data.entities[article].AA[author].AuId, res.data.entities[article].AA[author].DAuN)
                                }
                            }
                        }
                        tem.push(Array.from(ids));
                        if (tem.length == userInfo[0].length) {
                            let newArray = Array.prototype.concat.apply([], tem);
                            newArray.sort();
                            setAuthorIDArray(newArray);
                            setNameMap(tem_NameMap);
                        }
                    }
                }).catch(e => {
                    setError(true);
                    setLoading(false)
                })
            }
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
                    setLoading(false);
                    setAuthorArticle(authorArticle.concat(tem));
                }
            }).catch(e => {
                setError(true);
                setLoading(false)
            })
        }
    }, [authorIDArray])

    if (sessionStorage.getItem('login') === null) {
        if (props.location.state === null) return <NotFound />
        userInfo = props.location.state.userInfo;
        sessionStorage.setItem('login', JSON.stringify(userInfo))
    }
    else {
        userInfo = JSON.parse(sessionStorage.getItem('login'))
    }

    function capitalizeFirstLetter(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    const checkIfInArray = (array, item) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] === item[0]) {
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
            <div className="logoBar"><a><img className="logo-small" src={PubConnectLarge}></img></a></div>
            <Typography><Link className="clean-button" to='/'><Button variant="outlined" color="primary" onClick={() => sessionStorage.clear()}><ReplayIcon />Start Over</Button></Link></Typography>
            {isLoading && <div className="home_info_container"><CircularProgress /></div>}
            {error && <Typography className="home_info_container">Sorry we couldn't find any results. Please try again.</Typography>}
            {!isLoading && !error &&
                <Fragment>
                    <div className="home_text"><p>Based on the name(s) you provided, we have found <b>{authorArticle.length}</b> possible authors listed in Microsoft Academic that could be you. Please select the papers below that you authored.</p>
                    </div>
                    <div class="home_card_container">
                        {authorArticle.map(this_author => <Card className={classes.card} onClick={() => { handleCheckBox(this_author) }}>
                            <CardContent><Checkbox checked={checkIfInArray(checkedArray, this_author) !== -1}></Checkbox>
                                <Typography>{renderAuthorList(this_author[2].AA)}</Typography><Typography><i>{capitalizeFirstLetter(this_author[2].Ti)}</i></Typography><Typography>{this_author[2].VFN == undefined ? "" : this_author[2].VFN + ", "}{this_author[2].Y}</Typography></CardContent>
                        </Card>)}
                    </div>
                    {checkedArray.length !== 0 && <Link className={classes.link_button} to="/verify" state={{ checkedArray: checkedArray, userInfo: userInfo, nameMap: nameMap }}><Button fullWidth variant="outlined" color="primary">Continue</Button></Link>}
                </Fragment>
            }
        </div>
    )
}

export default Home;