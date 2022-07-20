/* eslint-disable no-console */
const database = require('../database');
const CREATE_SchoolManagementSystem_Table = require('../Createsqltable');

console.log(CREATE_SchoolManagementSystem_Table);


database
    .query(
        `
    DROP TABLE IF EXISTS ${CREATE_SchoolManagementSystem_Table};
    `,
    )
    .then(() => {
        console.log('Successfully created!');
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        database.end();
    })
    module.exports = CREATE_SchoolManagementSystem_Table;
