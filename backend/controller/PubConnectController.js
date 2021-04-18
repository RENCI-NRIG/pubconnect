const { response } = require('express');
const { connection } = require('../config/db');

exports.PubConnectInsert = async function (req, res) {
    const props = req.body;
    for (const this_id in props.checklist) {
        if (props.checklist[this_id][3] === false) {
            const _checkSQL = `SELECT * FROM paper WHERE ms_paper_id = ${props[this_id].Id}`;
            await connection.query(_checkSQL, async function (err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    const _paperSQL = `INSERT IGNORE INTO paper(ms_paper_id, doi) VALUES ('${props[this_id].Id}', '${props[this_id].DOI}')`;
                    await connection.query(_paperSQL, function (err, result) {
                        if (err) throw err;
                        console.log(`inserted into paper`)
                    })
                }
                if (props.checklist[this_id][0] === true) {
                    const _testbedPaperSQL = `INSERT INTO testbed_papers VALUES ('1',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                    await connection.query(_testbedPaperSQL, function (err, result) {
                        if (err) throw err;
                        console.log(`inserted into geni`)
                    })
                }
                if (props.checklist[this_id][1] === true) {
                    const _testbedPaperSQL = `INSERT INTO testbed_papers VALUES ('2',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                    await connection.query(_testbedPaperSQL, function (err, result) {
                        if (err) throw err;
                        console.log(`inserted into cloudtop`)
                    })
                }
                if (props.checklist[this_id][2] === true) {
                    const _testbedPaperSQL = `INSERT INTO testbed_papers VALUES ('3',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                    await connection.query(_testbedPaperSQL, function (err, result) {
                        if (err) throw err;
                        console.log(`inserted into chameleon`)
                    })
                }

            })
        }
    }
}

exports.PubConnectSaveUser = async function (req, res) {
    const props = req.body;
    for (let i = 0; i < props.checkedArray.length; i++) {
        const _institutionSQL = `INSERT IGNORE INTO affiliation(institution_name) VALUES ('${props.checkedArray[i][1]}')`
        await connection.query(_institutionSQL, function (err, result) {
            if (err) throw err;
            console.log(`inserted into institution`)
        })
        const _authorSQL = `INSERT IGNORE INTO author(email) VALUES ('${props['userInfo'][1]}')`
        await connection.query(_authorSQL, function (err, result) {
            if (err) throw err;
            console.log(`inserted into author`)
        })
        const _authorAffiliationSQL = `INSERT IGNORE INTO author_affiliation(author_id, institution_id) VALUES ((SELECT author_id FROM author WHERE email='${props['userInfo'][1]}'), (SELECT institution_id FROM affiliation WHERE institution_name='${props.checkedArray[i][1]}'))`
        await connection.query(_authorAffiliationSQL, function (err, result) {
            if (err) throw err;
            console.log(`inserted into author affiliation`)
        })

        const _authorMSidSQL = `INSERT IGNORE INTO author_id VALUES ((SELECT author_id FROM author WHERE email='${props['userInfo'][1]}'), '${props.checkedArray[i][0]}')`
        await connection.query(_authorMSidSQL, function (err, result) {
            if (err) throw err;
            console.log(`inserted into author author_msid`)
        })
    }
}

exports.PubConnectSave = async function (req, res) {
    const props = req.body;
    for (const this_id in props.checklist) {
        const _checkSQL = `SELECT * FROM paper WHERE ms_paper_id = ${props[this_id].Id}`;
        await connection.query(_checkSQL, async function (err, result) {
            if (err) throw err;
            if (result.length === 0 && props.checklist[this_id][3] === false) {
                const _paperSQL = `INSERT IGNORE INTO paper(ms_paper_id, doi) VALUES ('${props[this_id].Id}', '${props[this_id].DOI}')`;
                await connection.query(_paperSQL, function (err, result) {
                    if (err) throw err;
                    console.log(`inserted into paper`)
                })
                const _authorPaperSQL = `INSERT IGNORE INTO author_papers VALUES ((SELECT author_id FROM author WHERE email='${props['email']}'), (SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}'))`
                await connection.query(_authorPaperSQL, function (err, result) {
                    if (err) throw err;
                    console.log(`inserted into author_paper`)
                })
            }
            const _deleteSavedSQL = `DELETE FROM testbed_saved_papers WHERE paper_id = (SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')`;
            await connection.query(_deleteSavedSQL, function (err, result) {
                if (err) throw err;
            })

            if (props.checklist[this_id][0] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_saved_papers VALUES ('1',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection.query(_testbedPaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
            if (props.checklist[this_id][1] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_saved_papers VALUES ('2',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection.query(_testbedPaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
            if (props.checklist[this_id][2] === true) {
                const _testbedPaperSQL = `INSERT INTO testbed_saved_papers VALUES ('3',(SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')) ON DUPLICATE KEY UPDATE testbed_id=VALUES(testbed_id)`;
                await connection.query(_testbedPaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
            if (result.length !== 0 && props.checklist[this_id][3] === true) {
                const _deleteAuthorPaperSQL = `DELETE FROM author_papers WHERE paper_id= (SELECT paper_id FROM paper WHERE ms_paper_id='${props[this_id].Id}')`;
                await connection.query(_deleteAuthorPaperSQL, function (err, result) {
                    if (err) throw err;
                })

                const _deletePaperSQL = `DELETE FROM paper WHERE ms_paper_id='${props[this_id].Id}'`;
                await connection.query(_deletePaperSQL, function (err, result) {
                    if (err) throw err;
                })
            }
        })
    }
}