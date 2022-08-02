const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

const gpa_table = 'gpatable';
module.exports.gpa_table = gpa_table;

const GPA_table_sql = `
    CREATE TABLE ${gpa_table} (
        moduleid SERIAL primary key,
        modulecode VARCHAR not null,
        modulename VARCHAR not null,
        moduledetail VARCHAR not null,
        courseid INT not null,
        semestername varchar not null,
        CONSTRAINT fk_Courseid FOREIGN KEY(courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE
        
    );
`;
module.exports.GOA_table_sql = GPA_table_sql;