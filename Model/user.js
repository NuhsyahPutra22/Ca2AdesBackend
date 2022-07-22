const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require('./database');



module.exports.login2=function get(userName,UserPassword){
    return query(`SELECT * FROM user WHERE userName = ($1) and UserPassword = ($2)`, [
        userName,UserPassword ]) .then((result) => {
            if  (!result.rows.length) return null;
            console.log(result.rows);
            return (result.rows);
        });
  }