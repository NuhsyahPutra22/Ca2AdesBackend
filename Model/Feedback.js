const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

const feedback_table = 'feedbacktable';
module.exports.feedback_table = feedback_table;

const Feedback_table_sql = `
    CREATE TABLE ${feedback_table} (
        feedbackid SERIAL primary key,
        feedbackcontent VARCHAR not null,
        feedbackdate  DATE not null DEFAULT NOW(),
        userid INT not null,
        CONSTRAINT fk_userid FOREIGN KEY(userid) REFERENCES usertable(userid) ON DELETE CASCADE ON UPDATE CASCADE)
`;
module.exports.Feedback_table_sql = Feedback_table_sql;

//Get all Feedback
module.exports.GetAllFeedback = function get() {
    return query(`SELECT * FROM ${feedback_table}`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
//Get Feedback by ID
module.exports.GetFeedbackbyID = function get(feedbackid) {
    console.log(feedbackid);
    return query(`SELECT * FROM ${feedback_table} where feedbackid=$1`,[feedbackid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

// Make Feedback
module.exports.MakeFeedback = function add(currentfeedbackcontent,currentuserid) {
    return query(`INSERT INTO ${feedback_table}(feedbackcontent,userid) VALUES($1,$2) RETURNING *`, [
        currentfeedbackcontent, 
        currentuserid
    ])
        .then((response) => response.rows[0].currentuserid)
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, ` You are ${currentuserid} Not allowed to make another new feedback.`);
            } else throw error; // unexpected error
        });
};
//To delete feedback by userid

module.exports.DeleteFeedbackinfo= function get(currentuserid) {
    return query(`DELETE FROM ${feedback_table} where userid= $1`,[currentuserid]).then((result) => {
        if (!result.rows.length) return null;
        return result;
    });

};