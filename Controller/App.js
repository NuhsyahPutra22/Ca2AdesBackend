const express = require('express');
const cors = require('cors');
const bodyParser=require('body-parser');
const createHttpError = require('http-errors');
var isLoggedInMiddleWare=require('../auth/verifytoken');
const user=require('../Model/user');
const Course=require('../Model/Course');
const { query } = require('../database');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
module.exports = express()
    .use(cors())
    .use(express.json())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))


    //EndPoint UserTable

 


//LoginUser
.post('/login',(req,res,next)=>{
    const username = req.body.username;
    const userpassword = req.body.userpassword;
    if(!userpassword) {
        if (!userpassword) return next(createHttpError(404, ` password not found`));

    }
    return user.LoginUser(username,userpassword)
    .then((result) => {
        if (result === null) {
          // reads from response body
          res.status(401).send("Invalid login credentials").end();
        } else {
          console.log(result);

          let payload = {
            username:result.username,
            userrole:result.userrole
          };

          let tokenConfig = {
            expiresIn: 86400,
            algorithm: "HS256",
          };

          jwt.sign(payload, JWT_SECRET, tokenConfig, (error, token) => {
            if (error) {
              console.log(error);

              let errMsg = {
                message: "An error occured...",
              };

              res.status(401).type("json").send(errMsg.message).end();
            } else {
              res.status(200).send({
                token: token,
                username:result.username,
            userrole:result.userrole
              });
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });

})
//get all user 
.get('/user', (req, res, next) => {
    return user.GetAllUser()
        .then((result) => {
            if (!result) return next(createHttpError(404, `User Information ${result} not found`));
            return res.json(result).end();
        })
        .catch(next);
})

//get userbyid
.get('/user/:userid', (req, res, next) => {
    const userid=(req.params.userid)
    return user.GetUserbyID(userid)
        .then((result) => {
            if (!result) return next(createHttpError(404, `user Information ${result} not found`));
            return res.json(result).end();
        })
        .catch(next);
})

//add user
.post('/user', function (req, res,next) {
    const currentUserName=req.body.username;
    const currentUserPassword=req.body.userpassword;
    const currentUserEmail=req.body.useremail;
    const currentUserAddress=req.body.useraddress;
    const currentUserContactNumber=req.body.usercontactnumber;
    const currentCourseid=req.body.courseid;
    if (!currentUserEmail) {
        return next(createHttpError(400, "Please provide data"));
    }
    return user.AddUser(currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentCourseid)
    .then((currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentCourseid)=>res.status(201).json({currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentCourseid}))
    .catch(next);
    
      })


//update userinfo by userid
.put('/user/:userid', (req,res,next)=>{
    const  userid =parseInt(req.params.userid); 
    const username=req.body.username;
    const userpassword=req.body.userpassword;
    const useremail=req.body.useremail;
    const useraddress=req.body.useraddress;
    const usercontactnumber=req.body.usercontactnumber;
    const courseid=req.body.courseid;

console.log(userid,username,userpassword,useremail,useraddress,usercontactnumber,courseid);
 return user.UpdateUserinfo(userid,username,userpassword,useremail,useraddress,usercontactnumber,courseid)
 .then((result) => {
    if (!result) return next(createHttpError(404, ` userinfo ${result} not successfully updated`));
    console.log(result.rows);
    return res.json(result.rows).end();
})
.catch(next);
})

//delete user
.delete('/user/:userid',(req,res,next)=>{
    const userid=parseInt(req.params.userid);
    console.log(userid);       
    return user.DeleteUser(userid)
    .then((result) => res.status(200).send("Successfully deleted user").end())
        .catch(next);
})

//search
.get('/searchuser/:username',(req,res,next)=>{
    const username=(req.params.username)
    return user.searchuser(username)
    .then((result) => {
        if (!result) return next(createHttpError(404, ` username ${result} not found`));
        console.log(result);
        return res.json(result).end;
    })
    .catch(next);
})



//End Point CourseTable
//Get all the course
.get('/Course', (req, res, next) => {
    return Course.GetAllCourse()
        .then((result) => {
            if (!result) return next(createHttpError(404, `Course Information ${result} not found`));
            return res.json(result).end();
        })
        .catch(next);
})
//Get course by ID
.get('/Course/:courseid', (req, res, next) => {
    const courseid=(req.params.courseid)
    return Course.GetCoursebyID(courseid)
        .then((result) => {
            if (!result) return next(createHttpError(404, `Course Information ${result} not found`));
            return res.json(result).end();
        })
        .catch(next);
})
//Add Course
.post('/Course', function (req, res,next) {
    const currentCoursecode=req.body.coursecode;
    const currentCourseName=req.body.coursename;
    const currentCourseabbrev=req.body.courseabbrev;
    if (!currentCoursecode) {
        return next(createHttpError(400, "Please provide data"));
    }
    return Course.AddCourse(currentCoursecode,currentCourseName,currentCourseabbrev)
    .then((currentCoursecode,currentCourseName,currentCourseabbrev)=>res.status(201).json({currentCoursecode,currentCourseName,currentCourseabbrev}))
    .catch(next);
    
      })
      //Update a Course information
      .put('/Course/:courseid', (req,res,next)=>{
        const  courseid =parseInt(req.params.courseid); 
        const currentCoursecode=req.body.coursecode;
        const currentCourseName=req.body.coursename;
        const currentCourseabbrev=req.body.courseabbrev;

    console.log(courseid,currentCoursecode,currentCourseName,currentCourseabbrev);
     return Course.UpdateCourseinfo(courseid,currentCoursecode,currentCourseName,currentCourseabbrev)
     .then((result) => {
        if (!result) return next(createHttpError(404, ` courseinfo ${result} not successfully updated`));
        console.log(result.rows);
        return res.json(result.rows).end();
    })
    .catch(next);
})
//To delete Courseinfo by id 
.delete('/Course/:courseid',(req,res,next)=>{
    const courseid=parseInt(req.params.courseid);
    console.log(courseid);       
    return Course.DeleteCourseinfo(courseid)
    .then((result) => res.status(200).send("Successfully deleted CourseInfo").end())
        .catch(next);
})
//To get courseinfo by coursecode
.get('/Courseinfo/:coursecode',(req,res,next)=>{
    const currentCoursecode=(req.params.coursecode)
    return Course.GetCoursenamebyCoursecode(currentCoursecode)
    .then((result) => {
        if (!result) return next(createHttpError(404, ` Coursename ${result} not found`));
        console.log(result);
        return res.json(result).end;
    })
    .catch(next);
})
    
     
.use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)))
.use((error, req, res, next) => {
    console.error(error);
    next(error);
})
.use((error, req, res, next) => next(res.status(error.status || 500).json({ error: error.message || 'Unknown error' })));
