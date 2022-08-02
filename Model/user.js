const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require('../Database');

const user_table = 'usertable';
module.exports.user_table = user_table;

const user_table_sql = `
    CREATE TABLE ${user_table} (
        Userid SERIAL primary key,
        UserName VARCHAR not null,
        UserPassword VARCHAR not null,
        UserEmail VARCHAR not null,
        UserAddress VARCHAR not null,
        UserContactNumber VARCHAR not null,
        UserRole VARCHAR not null,
        Courseid INT not null,
        gpacalculation JSON Default '[]'::JSON,
        CONSTRAINT fk_Course_id FOREIGN KEY(Courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE
        
    );
`;
module.exports.user_table_sql = user_table_sql;

//LoginUser
module.exports.LoginUser=function get(username,userpassword){
    return query(`SELECT * FROM ${user_table} WHERE username = ($1) and userpassword = ($2)`, [
        username,userpassword ]) .then((result) => {
            if  (!result.rows.length) return null;
            console.log(result.rows);
           return (result.rows[0]);
        });
  }

  



//get all user
  module.exports.GetAllUser = function get() {
    return query(`SELECT a.userid, a.username,a.useremail,b.coursename,c.semestername from usertable a inner join coursetable b on b.courseid=a.courseid inner join moduletable c on c.courseid=a.courseid where userrole='Student';`,[])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        const userlist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const user = result.rows[i];
          userlist.push({
          
            userid:user.userid,
            username:user.username,
            useremail:user.useremail,
            coursename:user.coursename,
           semestername:user.semestername,
          });
        }
        console.log(userlist)
        return(userlist);
    });
};

//get user by id
module.exports.GetUserbyID = function get(userid) {
    console.log(userid);
    return query(`select * from ${user_table} u inner join coursetable c on c.courseid=u.courseid where u.userid=$1`,[userid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
         const userlist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const user = result.rows[i];
          userlist.push({
          

            userid:user.userid,
            useremail:user.useremail,
            userpassword:user.userpassword,
            useraddress:user.useraddress,
            usercontactnumber:user.usercontactnumber,
            courseid:user.courseid,
            coursecode:user.coursecode,
           coursename:user.coursename,
           courseid:user.courseid,
           courseabbrev:user.courseabbrev
          });
        }
        console.log(userlist)
        return(userlist);
    });
};
//Add user
module.exports.AddUser = function add(currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentUserRole,currentCourseid) {
    return query(`Insert into ${user_table}(username,userpassword,useremail,useraddress,usercontactnumber,userrole,courseid) values ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [
        currentUserName,
        currentUserPassword,
        currentUserEmail,
        currentUserAddress,
        currentUserContactNumber,
        currentUserRole,
        currentCourseid,
    ])
    .then((response) => response.rows[0].currentUserEmail)
    .catch((error) => {
        if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
            throw createHttpError(400, `Coursecode ${currentUserEmail} already exists`);
        } else throw error; // unexpected error
    });
};

//update  user info by userid
module.exports.UpdateUserinfo=function add(userid,userpassword,useremail,useraddress,usercontactnumber) {
    return query(`UPDATE ${user_table} SET userpassword= $2,useremail= $3,useraddress= $4,usercontactnumber= $5 where userid=$1  RETURNING *` , [userid,userpassword,useremail,useraddress,usercontactnumber])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

//delete user
module.exports.DeleteUser= function get(userid) {
    return query(`DELETE FROM ${user_table} where userid= $1`,[userid]).then((result) => {
        if (!result.rows.length) return null;
        return result;
    });

};
 
//search userinfo by username
module.exports.searchuser=function searchuser(username) {
    console.log(username)
    return query(`SELECT * From ${user_table} where username=$1`,[username])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};
