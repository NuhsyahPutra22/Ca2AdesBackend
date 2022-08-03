const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

const course_table = 'coursetable';
module.exports.course_table = course_table;

const Course_table_sql = `
    CREATE TABLE ${course_table} (
    Courseid SERIAL PRIMARY KEY,
    Coursecode VARCHAR(255) UNIQUE NOT NULL,
    CourseName VARCHAR(255) NOT NULL,
    Courseabbrev VARCHAR(255) NOT NULL  
        
    );
`;
module.exports.Course_table_sql = Course_table_sql;

//Get all course
module.exports.GetAllCourse = function get() {
    return query(`SELECT * FROM ${course_table}`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        // console.log(result.rows);
        const courselist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const course = result.rows[i];
          courselist.push({
          
            courseid:course.courseid,
            coursecode:course.coursecode,
            coursename:course.coursename,
            courseabbrev:course.courseabbrev
           
          });
        }
        console.log(courselist)
        return(courselist)
        // for (let i = 0; i < result.rows.length; i++){
        //     // console.log(result.rows[i] )
        //     return (result.rows[i] );
        // }
    });
};
//Get course by ID
module.exports.GetCoursebyID = function get(courseid) {
    console.log(courseid);
    return query(`SELECT * FROM ${course_table} where courseid=$1`,[courseid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        const courselist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const course = result.rows[i];
          courselist.push({
          
            courseid:course.courseid,
            coursecode:course.coursecode,
            coursename:course.coursename,
            courseabbrev:course.courseabbrev
           
          });
        }
        console.log(courselist)
        return(courselist)
    });
};
// Add Course
module.exports.AddCourse = function add(currentCoursecode, currentCourseName,currentCourseabbrev) {
    return query(`INSERT INTO ${course_table}(coursecode,coursename,courseabbrev) VALUES($1,$2,$3) RETURNING *`, [
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
    return query(`UPDATE ${course_table} SET coursecode = $2,coursename = $3,courseabbrev = $4 where courseid = $1  RETURNING *` , [courseid,currentCoursecode,currentCourseName,currentCourseabbrev])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

//To delete Courseinfobyid

module.exports.DeleteCourseinfo= function get(courseid) {
    return query(`DELETE FROM ${course_table} where courseid= $1`,[courseid]).then((result) => {
        if (!result.rows.length) return null;
        return result;
    });

};
//To get Courseinfo by Coursecode
module.exports.GetCoursenamebyCoursecode=function GetCoursenamebyCoursecode(currentCoursecode) {
    console.log(currentCoursecode)
    return query(`SELECT * From ${course_table} where coursecode=$1`,[currentCoursecode])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};
//To get courseid using the coursename 
module.exports.GetCourseidbyCoursename=function GetCourseidbyCoursename(currentCourseName) {
    console.log(currentCourseName)
    return query(`SELECT courseid From ${course_table} where coursename=$1`,[currentCourseName])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};

//To get coursename 
module.exports.GetCoursename=function GetCoursename() {
    return query(`SELECT courseid,coursename From ${course_table}`)
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};
    //To get coursename from courseid
module.exports.GetCoursenamebycourseid=function GetCoursenamenamebycourseid(courseid) {
    return query(`SELECT courseid,coursename From ${course_table} where courseid=$1` ,[courseid])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });

};