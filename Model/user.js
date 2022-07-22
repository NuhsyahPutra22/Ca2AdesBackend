const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require('../Database');



module.exports.LoginUser=function get(userName,UserPassword){
    return query(`SELECT * FROM UserTable WHERE userName = ($1) and UserPassword = ($2)`, [
        userName,UserPassword ]) .then((result) => {
            if  (!result.rows.length) return null;
            console.log(result.rows);
            return (result.rows);
        });
  }