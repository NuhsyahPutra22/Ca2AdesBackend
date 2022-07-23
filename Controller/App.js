const express = require('express');
const cors = require('cors');
const bodyParser=require('body-parser');
const createHttpError = require('http-errors');
var isLoggedInMiddleWare=require('../auth/verifytoken');
const user=require('../Model/user');
const Course=require('../Model/Course');
const { query } = require('../database');

module.exports = express()
    .use(cors())
    .use(express.json())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))


    //EndPoint UserTable

//LoginUser
.post('/login',(req,res,next)=>{
    const UserName = req.body.UserName;
    const UserPassword = req.body.UserPassword;
    if(!UserPassword) {
        if (!UserPassword) return next(createHttpError(404, ` password not found`));

    }
    return user.LoginUser(UserName,UserPassword,function (err, token, result) {
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password'];//clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
            res.send();
        } else {
            res.sendStatus(500);
            res.send(err.statusCode);
        }
    })
    // .then(user.LoginUser(UserName,UserPassword,(error,user)=>{
    //     if (error) {
    //         res.status(500).send();
    //         return;
    //     }
    //     if (user === null) {
    //         res.status(401).send();
    //         return;
    //     }
    //     const payload = {
    //         UserName: user.UserName,
    //         UserPassword: user.UserPassword
    //     };
    //     jwt.sign(
    //         // (1) payload
    //         payload,
    //         // (2) Secret key 
    //         JWT_SECRET,
    //         // (3) Signing Algorithm 
    //         { algorithm: "HS256" },
    //         // (4) response handle (callback function)
    //         (error, token) => {
    //             if (error) {
    //                 console.log(error);
    //                 res.status(401).send();
    //                 return;
    //             }
    //             res.status(200).send({
    //                 token: token,
    //                 UserName: user.UserName
    //             });
    //         })
            
    // }))
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
.post('/addnewuser', function (req, res,next) {
    const currentUserName=req.body.UserName;
    const currentUserPassword=req.body.UserPassword;
    const currentUserEmail=req.body.UserEmail;
    const currentUserAddress=req.body.UserAddress;
    const currentUserContactNumber=req.body.UserContactNumber;
    const currentUserRole=req.body.UserRole;
    const currentCourseid=req.body.Courseid;
    if (!currentUserName) {
        return next(createHttpError(400, "Please provide data"));
    }
    return user.AddUser(currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentUserRole,currentCourseid)
    .then((currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentUserRole,currentCourseid)=>res.status(201).json({currentUserName,currentUserPassword,currentUserEmail,currentUserAddress,currentUserContactNumber,currentUserRole,currentCourseid}))
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
