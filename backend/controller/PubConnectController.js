const { connection_pool } = require('../config/db');
const Cite = require('citation-js');

const PubConnectSaveUser = async (props) => {
    const userInputName = props.userInfo[0];
    const userInfo = props.checkedArray;
    let author_id = -1;
    let _authorSQL = `INSERT IGNORE INTO author(created_date, author_name) VALUES ('${new Date().toUTCString()}', '${userInputName}')`
    const [rows, fields] = await connection_pool.promise().query(_authorSQL);
    author_id = rows.insertId;
    console.log(`${author_id} is created`)
    for (let i = 0; i < userInfo.length; i++) {
        console.log(`processing user ${userInfo[i][0]}`)
        let _authorIDSQL = `INSERT IGNORE INTO author_id(author_id, ms_author_id) VALUES ('${author_id}','${userInfo[i][0]}')`
        const author_result = await connection_pool.promise().query(_authorIDSQL);
        console.log(`${userInfo[i][0]} added to author_id table`)
        if (userInfo[i][1] !== null) {
            const _institutionSQL = `INSERT IGNORE INTO affiliation(institution_name) VALUES ('${userInfo[i][1]}')`
            const [_institutionSQL_rows, _institutionSQL_fields] = await connection_pool.promise().query(_institutionSQL)
            const _authorAffiliationSQL = `INSERT IGNORE INTO author_affiliation(author_id, institution_id) VALUES ('${author_id}', (SELECT institution_id FROM affiliation WHERE institution_name='${userInfo[i][1]}'))`
            await connection_pool.promise().query(_authorAffiliationSQL)
            console.log(`${userInfo[i][1]} added to author affiliation table`)
        }
        if (i === userInfo.length - 1) {
            return author_id;
        }
    }
}

exports.PubConnectInsert = async function (req, res) {
    console.log("inserting into database")
    const props = req.body;
    const user_id = await PubConnectSaveUser(props);
    for (let i = 0; i < Object.keys(props.checklist).length; i++) {
        const this_id = Object.keys(props.checklist)[i];
        if (props.checklist[this_id][3] === false) {
            const _checkSQL = `SELECT * FROM paper WHERE ms_paper_id = ${props[this_id].Id}`;
            const [paperRows, paperFields] = await connection_pool.promise().query(_checkSQL);
            let this_paper_id;
            if (paperRows.length === 0) {
                try {
                    let paper_citation = Cite(props[this_id].DOI);
                    let citation_output = paper_citation.format('bibliography', {
                        type: 'string'
                    })
                    const _paperSQL = `INSERT IGNORE INTO paper(ms_paper_id, doi, venue, paper_citation) VALUES ('${props[this_id].Id}', '${props[this_id].DOI}', '${props[this_id].VFN === undefined ? undefined : props[this_id].VFN.replace(/'/g, "\\'")}', '${citation_output === undefined ? undefined : citation_output.replace(/'/g, "\\'")}')`;
                    const [newPaperRows, newPaperFields] = await connection_pool.promise().query(_paperSQL)
                    console.log(`${props[this_id].Id} added to paper table`)
                    this_paper_id = newPaperRows.insertId;
                }
                catch (e) {
                    console.log(e)
                }
            } else this_paper_id = paperRows[0]['paper_id'];
            const _authorPaperSQL = `INSERT INTO author_papers VALUES ('${user_id}', '${this_paper_id}')`;
            await connection_pool.promise().query(_authorPaperSQL);
            console.log(`${props[this_id].Id} added to author paper table`);
            if (props.checklist[this_id][0] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_papers VALUES ('1',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection_pool.promise().query(_testbedPaperSQL);
                console.log(`New GENI entry: ${props[this_id].Id}`);
            }
            if (props.checklist[this_id][1] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_papers VALUES ('2',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection_pool.promise().query(_testbedPaperSQL)
                console.log(`New Cloudtop entry: ${props[this_id].Id}`)
            }
            if (props.checklist[this_id][2] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_papers VALUES ('3',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection_pool.promise().query(_testbedPaperSQL)
                console.log(`New Chameleon entry: ${props[this_id].Id}`)
            }
        }
        if (this_id === Object.keys(props.checklist)[Object.keys(props.checklist).length - 1]) {
            console.log("Operation complete")
            res.send({ 'message': 'Success' })
        }
    }
}

exports.PubConnectSave = async function (req, res) {
    const props = req.body;
    for (let i = 0; i < Object.keys(props.checklist).length; i++) {
        const this_id = Object.keys(props.checklist)[i];
        const _checkSQL = `SELECT * FROM paper WHERE ms_paper_id = ${props[this_id].Id}`;
        await connection_pool.query(_checkSQL, async function (err, result) {
            if (err) throw err;
            if (result.length === 0 && props.checklist[this_id][3] === false) {
                const _paperSQL = `INSERT IGNORE INTO paper(ms_paper_id, doi) VALUES ('${props[this_id].Id}', '${props[this_id].DOI}')`;
                await connection_pool.query(_paperSQL, function (err, result) {
                    if (err) throw err;
                    console.log(`inserted into paper`)
                })
                const _authorPaperSQL = `INSERT IGNORE INTO author_papers VALUES ((SELECT author_id FROM author WHERE email='${props['email']}'), (SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}'))`
                await connection_pool.query(_authorPaperSQL, function (err, result) {
                    if (err) throw err;
                    console.log(`inserted into author_paper`)
                })
            }
            const _deleteSavedSQL = `DELETE FROM testbed_saved_papers WHERE paper_id = (SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')`;
            await connection_pool.query(_deleteSavedSQL, function (err, result) {
                if (err) throw err;
            })

            if (props.checklist[this_id][0] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_saved_papers VALUES ('1',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection_pool.query(_testbedPaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
            if (props.checklist[this_id][1] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_saved_papers VALUES ('2',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection_pool.query(_testbedPaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
            if (props.checklist[this_id][2] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_saved_papers VALUES ('3',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection_pool.query(_testbedPaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
            if (result.length !== 0 && props.checklist[this_id][3] === true) {
                const _deleteAuthorPaperSQL = `DELETE FROM author_papers WHERE paper_id= (SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')`;
                await connection_pool.query(_deleteAuthorPaperSQL, function (err, result) {
                    if (err) throw err;
                })

                const _deletePaperSQL = `DELETE FROM paper WHERE ms_paper_id='${props[this_id].Id}'`;
                await connection_pool.query(_deletePaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
        })
        if (this_id === Object.keys(props.checklist)[Object.keys(props.checklist).length - 1]) {
            res.send({ 'message': 'Data inserted into database.' })
        }
    }
}