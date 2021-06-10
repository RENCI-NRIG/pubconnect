import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from '@reach/router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles, FormHelperText } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import PubConnectLarge from '../PC-large.png'
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import '../App.css';


const useStyles = makeStyles((theme) => ({
    container: {
        width: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    yearTag: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    yearBtn: {
        margin: theme.spacing(1)
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%'
    },
    submitBtn: {
        textDecoration: 'none'
    },
    firstItemInYear: {
        paddingTop: 10,
        fontSize: 19
    },
    root: {
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        borderBottom: '0px'
    },
    card: {
        backgroundColor: '#d9d9d9'
    },
    authors: {
        maxWidth: '700px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    noMaxWidth: {
        maxWidth: 'none',
        fontSize: 12,
        float: 'left'
    }
}))

function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function Verify(props) {
    let checkedInfo;
    if (props.location.state === null) {
        if (sessionStorage.getItem('home') === null) {
            navigate('/', { replace: true })
        }
        else {
            checkedInfo = JSON.parse(sessionStorage.getItem('home'))
        }
    }
    else {
        checkedInfo = props.location.state.checkedArray;
        console.log(props.location)
        sessionStorage.setItem('home', JSON.stringify(checkedInfo));
        sessionStorage.setItem('nameMap', JSON.stringify(props.location.state.nameMap, replacer))
    }
    const currUser = checkedInfo;
    const classes = useStyles();
    const [papers, setPaper] = useState([]);
    const [authorID, setAuthorID] = useState();
    const [currPaper, setCurrPaper] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [currPageTotal, setPageTotal] = useState(0);
    const [checkedList, setCheckList] = useState({});
    const [results, setResults] = useState({});
    const [submitForm, setSubmitForm] = useState(false);
    const navigate = useNavigate();
    const baseUrl = window.location.origin;

    const saveUser = () => {
        axios({
            method: 'POST',
            url: `${baseUrl}:5000/save_user`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(props.location.state)
        })
    }

    useEffect(async () => {
        // saveUser();
        let tem = [];
        let tem_results = {};
        for (let index in currUser) {
            const currAuthorID = currUser[index][0];
            console.log(currAuthorID)

            const result = await axios({
                method: 'GET',
                url: 'https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate',
                params: {
                    expr: `And(Composite(AA.AuId=${currAuthorID}), Y>=2011)`,
                    attributes: 'Y,AA.AuId,AA.DAuN,Id,DOI,DN,VFN',
                    'subscription-key': 'f6714001211242e982d92a3646ececed',
                    count: 1000
                }
            }).then(res => {
                let id = 0;
                let years = [];
                let fullYearPaper = {};
                let namelist = [];
                let filteredArray = [];
                let tem_checklist = {};
                tem = tem.concat(res.data.entities);
                if (index == currUser.length - 1) {
                    tem.forEach(paper => {
                        if (!namelist.includes(paper.DN)) {
                            // find the first item in a year, give a first field
                            if (!years.includes(paper.Y)) {
                                paper['firstItemInYear'] = true;
                                years.push(paper.Y);
                            }
                            filteredArray.push(paper);
                            namelist.push(paper.DN);
                            tem_checklist[paper.Id] = [false, false, false, true];
                            tem_results[paper.Id] = paper;
                        }
                    })
                    filteredArray.sort((a, b) => {
                        return b.Y - a.Y
                    });
                    setCheckList(sessionStorage.getItem('checklist') === null ? tem_checklist : JSON.parse(sessionStorage.getItem('checklist')));
                    setResults(tem_results);
                    setPaper(filteredArray);
                    setCurrPaper(filteredArray.slice(0, 10));
                    setPageTotal(Math.ceil(filteredArray.length / 10))
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [])

    useEffect(() => {
        if (currPageTotal !== 0) {
            setCurrPaper(papers.slice(10 * (currPage - 1), 10 * (currPage)))
        }
    }, [currPage])

    function capitalizeFirstLetter(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    function capitalizeAuthorName(s) {
        s = capitalizeFirstLetter(s)
        return s.replaceAll(/ [a-z]/g, z => z.toUpperCase());
    }

    const renderAuthorList = authors => {
        let authorList = "";
        for (let id in authors) {
            if (authorList !== '') authorList += ", "
            authorList += authors[id].DAuN
        }
        return authorList;
    }


    const handlePageChange = (event, value) => {
        // results['checklist'] = checkedList;
        // results['email'] = props.location.state.userInfo[1];
        // axios({
        //     url: `${baseUrl}:5000/save`,
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     data: JSON.stringify(results)
        // }).then(res => { })
        //     .catch(e => console.log(e))
        setCurrPage(value);
    }

    const handleCheckBox = (id, field) => {
        let newCheckList = JSON.parse(JSON.stringify(checkedList));
        if (field == 3 && checkedList[id][3] == false) {
            newCheckList[id][0] = false;
            newCheckList[id][1] = false;
            newCheckList[id][2] = false;
        }
        else if (checkedList[id][3] == true) {
            newCheckList[id][3] = false;
        }
        newCheckList[id][parseInt(field)] = !checkedList[id][parseInt(field)];
        setCheckList(newCheckList);
        sessionStorage.setItem('checklist', JSON.stringify(newCheckList));
    }

    const handleDataSubmit = () => {
        results['checklist'] = checkedList;
        results['checkedArray'] = props.location.state.checkedArray;
        results['userInfo'] = props.location.state.userInfo
        axios({
            url: `${baseUrl}:5000/insert`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(results)
        }).then(res => {
            console.log(res.data)
            navigate('/submit', { replace: true })
        }).catch(e => console.log(e))
    }

    return (
        <Container className={classes.container}>
            <div className="logoBar"> <div className="verify_back_button"><Link className="clean-button" to='/home'><Button variant="outlined" color="primary"><ArrowBackIcon />Go Back</Button></Link></div><a><img className="logo-small" src={PubConnectLarge}></img></a></div>
            <br />
            {currPage == 1 ? <Card className={classes.card}><CardContent>Based on the paper(s) you selected, we've found all other papers of yours listed in Microsoft Academic. For each paper, please select any testbeds you used to conduct the research. By default, <b>None</b> (meaning no testbed was used) is checked.</CardContent></Card> : <span />}
            <br />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell></TableCell>
                        <TableCell>GENI</TableCell>
                        <TableCell>Cloudlab</TableCell>
                        <TableCell>Chameleon</TableCell>
                        <TableCell>None</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currPaper.map((paper, index) => <TableRow key={paper.DN}>{
                        paper.firstItemInYear || index === 0 ? <TableCell classes={{ root: classes.root }}><Typography className={classes.firstItemInYear}><b>{paper.Y}</b></Typography></TableCell> : <span></span>
                    }
                        <TableCell><div><Typography><b><i>{paper.DN}</i></b></Typography><Tooltip title={renderAuthorList(paper.AA)} placement="bottom-start" classes={{ tooltip: classes.noMaxWidth }}><Typography className={classes.authors}>{renderAuthorList(paper.AA)}</Typography></Tooltip><Typography>{paper.VFN}</Typography></div></TableCell>
                        <TableCell><Checkbox checked={checkedList[paper.Id][0]} onChange={() => handleCheckBox(paper.Id, 0)}></Checkbox></TableCell>
                        <TableCell><Checkbox checked={checkedList[paper.Id][1]} onChange={() => handleCheckBox(paper.Id, 1)}></Checkbox></TableCell>
                        <TableCell><Checkbox checked={checkedList[paper.Id][2]} onChange={() => handleCheckBox(paper.Id, 2)}></Checkbox></TableCell>
                        <TableCell><Checkbox checked={checkedList[paper.Id][3]} onChange={() => handleCheckBox(paper.Id, 3)}></Checkbox></TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
            <Dialog open={submitForm} onClose={() => setSubmitForm(false)}>
                <DialogContent>Are you sure you want to submit your survey?</DialogContent>
                <DialogActions><Button color="secondary" onClick={() => setSubmitForm(false)}>No</Button><Button color="primary" onClick={handleDataSubmit}>Yes</Button></DialogActions>
            </Dialog>
            <div className={classes.buttonContainer}>
                <Pagination count={currPageTotal} page={currPage} onChange={handlePageChange} />{currPage === currPageTotal ? <div className="verify_save_button"><Button variant="outlined" fullWidth="true" onClick={() => setSubmitForm(true)} color="secondary">Submit</Button></div> : <div className="verify_save_button"><Button color="primary" fullWidth="true" variant="outlined" onClick={() => setCurrPage(currPage + 1)}>Save and Continue</Button></div>}
            </div>
        </Container>
    )
}

export default Verify;