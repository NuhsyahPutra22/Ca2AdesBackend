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
module.exports.getCoursebyID = function get(Courseid) {
    console.log(Courseid);
    return query(`SELECT * FROM CourseTable where Courseid=$1`,[Courseid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};