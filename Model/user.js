const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require('../Database');



module.exports.LoginUser=function get(UserName,callback){
    return query(`SELECT username FROM UserTable WHERE userid = ($1) and UserPassword = ($2)`, [
        UserName ]) .then((result) => {
            if  (!result.rows.length) return null;
            console.log(result.rows);
            var token = "";
            var i;
            if (result.length == 1) {

                token = jwt.sign({ UserName:result.rows}, config.key, {
                    expiresIn: 86400 //expires in 24 hrs
                });
                console.log("@@token " + token);
                return callback(null, token, result.rows);


            } else {
                var err2 = new Error("UserID/Password does not match.");
                err2.statusCode = 500;
                return callback(err2, null, null);
            }
          //  return (result.rows);
        });
  }


 