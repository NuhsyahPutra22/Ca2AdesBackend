const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

//Get all course
module.exports.GetAllCourse = function get() {
    return query(`SELECT * FROM CourseTable`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
//Get course by ID
module.exports.GetCoursebyID = function get(courseid) {
    console.log(courseid);
    return query(`SELECT * FROM CourseTable where courseid=$1`,[courseid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
// Add Course
module.exports.AddCourse = function add(currentCoursecode, currentCourseName,currentCourseabbrev) {
    return query(`INSERT INTO coursetable(coursecode,coursename,courseabbrev) VALUES($1,$2,$3) RETURNING *`, [
        currentCoursecode,
        currentCourseName,
        currentCourseabbrev
    ])
        .then((response) => response.rows[0].currentCoursecode)
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, `Coursecode ${currentCoursecode} already exists`);
            } else throw error; // unexpected error
        });
};
//To update the all the coursetable info
module.exports.UpdateCourseinfo=function add(courseid,currentCoursecode,currentCourseName,currentCourseabbrev) {
    return query(`UPDATE coursetable SET coursecode = $2,coursename = $3,courseabbrev = $4 where courseid = $1  RETURNING *` , [courseid,currentCoursecode,currentCourseName,currentCourseabbrev])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

//To delete Courseinfobyid

module.exports.DeleteCourseinfo= function get(courseid) {
    return query(`DELETE FROM coursetable where courseid= $1`,[courseid]).then((result) => {
        if (!result.rows.length) return null;
        return result;
    });

};
//To get Coursename by Coursecode
module.exports.GetCoursenamebyCoursecode=function GetCoursenamebyCoursecode(currentCoursecode) {
    console.log(currentCoursecode)
    return query(`SELECT * From coursetable  where coursecode=$1`,[currentCoursecode])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};