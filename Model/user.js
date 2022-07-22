const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require('../Database');



module.exports.LoginUser=function get(UserName,UserPassword){
    return query(`SELECT * FROM UserTable WHERE UserName = ($1) and UserPassword = ($2)`, [
        UserName,UserPassword ]) .then((result) => {
            if  (!result.rows.length) return null;
            console.log(result.rows);
            return (result.rows);
        });
  }