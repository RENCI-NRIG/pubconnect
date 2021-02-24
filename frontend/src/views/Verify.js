import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Button, Card, CardContent, Container, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, makeStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    container: {
        margin: theme.spacing(2)
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
        justifyContent: 'center'
    },
    submitBtn: {
        textDecoration: 'none'
    },
    topBar: {
        display: 'flex'
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
    }
}))

function Verify(props) {
    const currUser = props.location.userInfo;
    const prevData = props.location.prevData;
    const classes = useStyles();
    const [papers, setPaper] = useState([]);
    const [currYear, setYear] = useState(0);
    const [currYears, setYears] = useState([]);
    const [currFullYearPaper, setFullYearPaper] = useState({});
    const [currPaper, setCurrPaper] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [currCheckbox, setCurrCheckbox] = useState([]);
    const [currPageTotal, setPageTotal] = useState(0);
    const [checkedList, setCheckList] = useState({});

    useEffect(async () => {
        let tem = [];
        for (let index in currUser) {
            const currAuthorID = currUser[index];
            console.log(currAuthorID)
            const result = await axios({
                method: 'GET',
                url: 'https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate',
                params: {
                    expr: `And(Composite(AA.AuId=${currAuthorID}), Y>=2011)`,
                    attributes: 'Y,AA.AuId,AA.AuN,Ti,VFN',
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
                        if (!namelist.includes(paper.Ti)) {
                            // find the first item in a year, give a first field
                            if (!years.includes(paper.Y)) {
                                paper['firstItemInYear'] = true;
                                years.push(paper.Y);
                            }
                            filteredArray.push(paper);
                            namelist.push(paper.Ti);
                            tem_checklist[paper.Ti] = [false, false, false, true];
                            if (fullYearPaper[paper.Y] === undefined) {
                                fullYearPaper[paper.Y] = []
                            }
                            fullYearPaper[paper.Y].push(paper);
                            paper['GENI'] = false;
                            paper['Cloudlab'] = false;
                            paper['Chameleon'] = false;
                            paper['None'] = true;

                        }
                    })
                    filteredArray.sort((a, b) => {
                        return b.Y - a.Y
                    });
                    setCheckList(tem_checklist);
                    setFullYearPaper(fullYearPaper);
                    setPaper(filteredArray);
                    setCurrPaper(filteredArray.slice(0, 10));
                    setPageTotal(Math.floor(filteredArray.length / 10) + 1)
                    let plainCheckbox = [];
                    plainCheckbox[filteredArray.length - 1] = [0, 0, 0, 1];
                    let filledCheckbox = plainCheckbox.fill([false, false, false, true], 0, filteredArray.length - 1);
                    setCurrCheckbox(filledCheckbox);
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }, [currUser])

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
            authorList += capitalizeAuthorName(authors[id].AuN)
        }
        return authorList;
    }


    const handlePageChange = (event, value) => {
        setCurrPage(value);
    }

    const handleCheckBox = (name, field) => {
        console.log(checkedList);
        console.log(field);
        let newCheckList = JSON.parse(JSON.stringify(checkedList));
        if (field == 3 && checkedList[name][3] == false) {
            newCheckList[name][0] = false;
            newCheckList[name][1] = false;
            newCheckList[name][2] = false;
        }
        else if(checkedList[name][3] == true){
            newCheckList[name][3] = false;
        }
        newCheckList[name][parseInt(field)] = !checkedList[name][parseInt(field)];
        console.log(newCheckList);
        setCheckList(newCheckList);
    }

    return (
        <div>
            <Container className={classes.container}>
                <div className={classes.topBar}><Typography><Link to={{ pathname: '/home', userInfo: prevData }}><Button><ArrowBackIcon /></Button></Link></Typography> <Link className={classes.submitBtn} to={{ pathname: '/submit', checkedList: checkedList, papers: papers, ids: currUser }}><Button variant="outlined" fullWidth color="secondary">Submit</Button></Link></div>
                <br />
                {currPage == 1 ? <Card className={classes.card}><CardContent>Based on the name(s) you gave us at the start of the survey, we have pulled all the papers listed in Microsoft Academic that you have authored since 2011. Please select the testbed(s) that were used in the research about which the paper reports. By default, None (meaning no testbed was used) is checked.</CardContent></Card> : <span />}
                <br />
                <div className={classes.buttonContainer}><Pagination count={currPageTotal} page={currPage} onChange={handlePageChange} /> </div>
                {/* <div className={classes.yearTag}>Filter by years: {currYears.map(year => <Button variant="outlined" className={classes.yearBtn} color="primary" onClick={() => { setCurrPage(1); setYear(year); }}>{year}</Button>)}<Button variant="outlined" className={classes.yearBtn} color="primary" onClick={() => {
                    setYear(0);
                    setCurrPaper(papers.slice(0, 10));
                    setPageTotal(Math.floor(papers.length / 10) + 1)
                }}>ALL</Button></div> */}
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
                        {currPaper.map((paper, index) => <TableRow>{
                            paper.firstItemInYear ? <TableCell classes={{ root: classes.root }}><Typography className={classes.firstItemInYear}><b>{paper.Y}</b></Typography></TableCell> : <span></span>
                        }
                            <TableCell><div><Typography>{renderAuthorList(paper.AA)}</Typography><Typography>{capitalizeFirstLetter(paper.Ti)}</Typography><Typography>{paper.VFN}</Typography></div></TableCell>
                            <TableCell><Checkbox checked={checkedList[paper.Ti][0]} onChange={() => handleCheckBox(paper.Ti, 0)}></Checkbox></TableCell>
                            <TableCell><Checkbox checked={checkedList[paper.Ti][1]} onChange={() => handleCheckBox(paper.Ti, 1)}></Checkbox></TableCell>
                            <TableCell><Checkbox checked={checkedList[paper.Ti][2]} onChange={() => handleCheckBox(paper.Ti, 2)}></Checkbox></TableCell>
                            <TableCell><Checkbox checked={checkedList[paper.Ti][3]} onChange={() => handleCheckBox(paper.Ti, 3)}></Checkbox></TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
                <div className={classes.buttonContainer}>
                    <Pagination count={currPageTotal} page={currPage} onChange={handlePageChange} />
                </div>
            </Container>
        </div>
    )
}

export default Verify;