const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

module.exports.getAllCourse = function get() {
    return query(`SELECT * FROM CourseTable`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
module.exports.getCoursebyID = function get(courseid) {
    console.log(courseid);
    return query(`SELECT * FROM CourseTable where courseid=$1`,[courseid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
module.exports.addCourse = function add(currentCoursecode, currentCoursename,currentCourseabbrev) {
    return query(`INSERT INTO coursetable(coursecode,coursename,courseabbrev) VALUES($1,$2,$3) RETURNING  *`, [
        currentCoursecode,
        currentCoursename,
        currentCourseabbrev
    ])
        .then((response) => response.rows[0].currentCoursecode)
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, `Coursecode ${currentCoursecode} already exists`);
            } else throw error; // unexpected error
        });

};