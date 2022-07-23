/* eslint-disable no-console */
const database = require('../database');
const user=require('../Model/user');
const course=require('../Model/Course');
const Module=require('../Model/Module');
const Feedback=require('../Model/Feedback');
console.log(user);
console.log(course);
console.log(Module);
console.log(Feedback);

database
    .query(
        `
    ALTER TABLE ${user.user_table}
    DROP CONSTRAINT fk_Course_id CASCADE;
    ALTER TABLE ${Module.module_table}
    DROP CONSTRAINT fk_Courseid CASCADE;
    ALTER TABLE ${Feedback.feedback_table}
    DROP CONSTRAINT fk_userid CASCADE;
    DROP TABLE IF  EXISTS ${user.user_table};
    ${user.user_table_sql}
    DROP TABLE IF  EXISTS ${course.course_table};
    ${course.Course_table_sql}
    DROP TABLE IF  EXISTS ${Module.module_table};
    ${Module.Module_table_sql}
    DROP TABLE IF  EXISTS ${Feedback.feedback_table};
    ${Feedback.Feedback_table_sql}
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
