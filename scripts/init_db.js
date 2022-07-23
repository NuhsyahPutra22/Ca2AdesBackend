/* eslint-disable no-console */
const database = require('../database');
const user=require('../Model/user');
const course=require('../Model/Course');
console.log(user);
console.log(course);


database
    .query(
        `
    ALTER TABLE ${user.user_table}
    DROP CONSTRAINT fk_Course_id CASCADE;
    DROP TABLE IF  EXISTS ${user.user_table};
    ${user.user_table_sql}
    DROP TABLE IF  EXISTS ${course.course_table};
    ${course.Course_table_sql}
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
