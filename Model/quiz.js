const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

const quiz_table = 'quiztable';
module.exports.quiz_table = quiz_table;

const Quiz_table_sql = `
    CREATE TABLE quiztable (
        quizid SERIAL primary key,
        q1 VARCHAR not null,
        q2 VARCHAR not null,
        q3 VARCHAR not null,
        q4 VARCHAR not null,
        q5 VARCHAR not null,
        q6 VARCHAR not null,
        q7 VARCHAR not null,
        q8 VARCHAR not null,
        q9 VARCHAR not null,
        q10 VARCHAR not null,
        total_score INT not null,
        userid INT not null,
        CONSTRAINT fk_Userid FOREIGN KEY(userid) REFERENCES usertable(Userid) ON DELETE CASCADE ON UPDATE CASCADE
);
`;
module.exports.Quiz_table_sql = Quiz_table_sql;

//Get all quiz attempts
module.exports.GetAllAttempts = function get() {
    return query(`SELECT * FROM ${quiz_table}`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        const quizlist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const quiz = result.rows[i];
          quizlist.push({
          
            q1:quiz.q1,
            q2:quiz.q2,
            q3:quiz.q3,
            q4:quiz.q4,
            q5:quiz.q5,
            q6:quiz.q6,
            q7:quiz.q7,
            q8:quiz.q8,
            q9:quiz.q9,
            q10:quiz.q10,
            total_score:quizlist.total_score,
           
          });
        }
        console.log(quizlist);
        return(quizlist);
    });
};

//Get all Quiz Attempts by userid
module.exports.GetAllAttempts = function get() {
    return query(`SELECT * FROM ${quiz_table} WHERE Userid=$1`,[Userid])
    .then((result) => {
        if  (!result.rows.length) return null;
        const quizlist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const quiz = result.rows[i];
          quizlist.push({
          
            q1:quiz.q1,
            q2:quiz.q2,
            q3:quiz.q3,
            q4:quiz.q4,
            q5:quiz.q5,
            q6:quiz.q6,
            q7:quiz.q7,
            q8:quiz.q8,
            q9:quiz.q9,
            q10:quiz.q10,
            total_score:quiz.total_score,
           
          });
        }
        console.log(quizlist);
        return(quizlist);
    });
};

// delete quiz attempt by id
module.exports.DeleteAttemptByID= function get(quizid) {
    return query(`DELETE FROM ${quiz_table} where quizid= $1`,[quizid]).then((result) => {
        if (!result.rows.length) return null;
        return result;
    });

};

// create quiz attempt
// Add Module
module.exports.CreateAttempt = function add(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, total_score) {
    return query(`INSERT INTO ${module_table}(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, total_score) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
    RETURNING *`, 
    [
        q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, total_score   
    ])
        .then((response) => response.rows[0])
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, `QuizID ${quizid} already exists`);
            } else throw error; // unexpected error
        });
};