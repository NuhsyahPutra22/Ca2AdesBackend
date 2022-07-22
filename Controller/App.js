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



//End Point CourseTable
//Get all the course
.get('/Course', (req, res, next) => {
    return Course.getAllCourse()
        .then((result) => {
            if (!result) return next(createHttpError(404, `Course Information ${result} not found`));
            return res.json(result).end();
        })
        .catch(next);
})
//Get course by ID
.get('/Course/:courseid', (req, res, next) => {
    const courseid=(req.params.courseid)
    return Course.getCoursebyID(courseid)
        .then((result) => {
            if (!result) return next(createHttpError(404, `Course Information ${result} not found`));
            return res.json(result).end();
        })
        .catch(next);
})
//Add Course
.post('/Course', function (req, res) {
    const Courseinfo={
        currentCoursecode:req.body.coursecode,
        currentCoursename:req.body.coursename,
        currentCourseabbrev:req.body.courseabbrev
    };
    console.log(Courseinfo);
    if (!Courseinfo) {
        return next(createHttpError(400, "Please provide data"));
      }
      return Course.addCourse(Courseinfo).then((result) => {
        console.log(result.rows);
        if (!result) {
          return next(createHttpError(404, `Error`));
        }
        console.log(result.row);
        res.status(201).send("Course Successfully inserted").end();
      }); 
    }
  )
.use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)))
.use((error, req, res, next) => {
    console.error(error);
    next(error);
})
.use((error, req, res, next) => next(res.status(error.status || 500).json({ error: error.message || 'Unknown error' })));
