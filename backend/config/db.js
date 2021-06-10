const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'pub-connect_db_1',
  user: 'user',
  password: 'password',
  database: 'db'
})

const initializeDB = () => {
  const authorDB_sql = 'CREATE TABLE IF NOT EXISTS author( author_id int NOT NULL AUTO_INCREMENT, ms_author_id int UNIQUE, PRIMARY KEY(author_id))';
  const testbedDB_sql = 'CREATE TABLE IF NOT EXISTS testbed (testbed_id int NOT NULL AUTO_INCREMENT, testbed_name varchar(255) UNIQUE, PRIMARY KEY(testbed_id))';
  const paperDB_sql = 'CREATE TABLE IF NOT EXISTS paper ( paper_id int NOT NULL AUTO_INCREMENT, ms_paper_id varchar(255) NOT NULL UNIQUE, doi varchar(255), PRIMARY KEY(paper_id))';
  const affiliationDB_sql = 'CREATE TABLE IF NOT EXISTS affiliation ( institution_id int NOT NULL AUTO_INCREMENT, institution_name varchar(255) UNIQUE, PRIMARY KEY(institution_id))';
  const authorAffiliationDB_sql = 'CREATE TABLE IF NOT EXISTS author_affiliation (author_id int NOT NULL, institution_id int, FOREIGN KEY(author_id) REFERENCES author(author_id), FOREIGN KEY(institution_id) REFERENCES affiliation(institution_id), UNIQUE(author_id, institution_id))';
  // const authoridDB_sql = 'CREATE TABLE IF NOT EXISTS author_id( author_id int NOT NULL, ms_author_id int, FOREIGN KEY(author_id) REFERENCES author(author_id), UNIQUE(author_id, ms_author_id))'
  const authorPapersDB_sql = 'CREATE TABLE IF NOT EXISTS author_papers( author_id int NOT NULL, paper_id int, FOREIGN KEY(author_id) REFERENCES author(author_id), FOREIGN KEY(paper_id) REFERENCES paper(paper_id), UNIQUE(author_id, paper_id))'
  const GENISetup = 'INSERT IGNORE INTO testbed(testbed_name) VALUES ("GENI")';
  const CloudlabSetup = 'INSERT IGNORE INTO testbed(testbed_name) VALUES ("Cloudlab")';
  const ChameleonSetup = 'INSERT IGNORE INTO testbed(testbed_name) VALUES ("Chameleon")';
  const testbedPaperDB_sql = 'CREATE TABLE IF NOT EXISTS testbed_papers (testbed_id int NOT NULL, paper_id int NOT NULL, FOREIGN KEY(testbed_id) REFERENCES testbed(testbed_id), FOREIGN KEY(paper_id) REFERENCES paper(paper_id), UNIQUE(testbed_id, paper_id))';
  const arrays = [affiliationDB_sql, authorDB_sql, paperDB_sql, testbedDB_sql, authorAffiliationDB_sql, authorPapersDB_sql, testbedPaperDB_sql, GENISetup, CloudlabSetup, ChameleonSetup];

  connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to host pub-connect_db_1");
    arrays.forEach(query => {
      connection.query(query, function (err, result) {
        if (err) throw err;
        console.log(`database created`)
      })
    })
  });
}

module.exports = {
  connection,
  initializeDB
}
