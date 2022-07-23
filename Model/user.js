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

//get all user
  module.exports.GetAllUser = function get() {
    return query(`SELECT * FROM UserTable`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

//get user by id
module.exports.GetUserbyID = function get(userid) {
    console.log(userid);
    return query(`select * from usertable u inner join coursetable c on c.courseid=u.courseid where u.userid=$1`,[userid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

module.exports.AddUser = function add(currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentUserRole,currentCourseid) {
    return query(`Insert into Usertable(UserName,UserPassword,UserEmail,UserAddress,UserContactNumber,UserRole,Courseid) 
    values ($1,$2,$3,$4,$5,$6,$7);`, [
        currentUserName,
        currentUserPassword,
        currentUserEmail,
        currentUserAddress,
        currentUserContactNumber,
        currentUserRole,
        currentCourseid
    ])
        .then((response) => response.rows[0].currentUserName)
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, `User ${currentUserName} already exists`);
            } else throw error; // unexpected error
        });
};
 