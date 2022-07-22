const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../databaseConn");

const Course ={
    insertCourseInfo: (Course) => {

        const sql =`INSERT INTO Course( Coursecode,)
        values($1,$2,$3)
        RETURNING *`
    
        return query(sql, [])
                .then((result) => {
                    //console.log(result);
                    return result;
                    //function
                })
                .catch((error) => {
                    console.log(error);
                    throw error;
                })
    },
}