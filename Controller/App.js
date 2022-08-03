const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const createHttpError = require('http-errors');
const verifytoken = require('../auth/verifytoken');
const user = require('../Model/user');
const Course = require('../Model/Course');
const Module = require('../Model/Module');
const Feedback = require('../Model/Feedback');
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
    .post('/login', (req, res, next) => {
        const username = req.body.username;
        const userpassword = req.body.userpassword;
        if (!userpassword) {
            if (!userpassword) return next(createHttpError(404, ` password not found`));

        }
        return user.LoginUser(username, userpassword)
            .then((result) => {
                if (result === null) {
                    // reads from response body
                    res.status(401).send("Invalid login credentials").end();
                } else {
                    console.log(result);

                    let payload = {
                        username: result.username,
                        userrole: result.userrole,
                        courseid:result.courseid
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
                                username: result.username,
                                userrole: result.userrole,
                                courseid:result.courseid,
                                userid:result.userid
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
                return res.status(200).send({
                    result
                      
                    });
            })
            .catch(next);
    })

    //get userbyid
    .get('/user/:userid', (req, res, next) => {
        const userid = (req.params.userid)
        return user.GetUserbyID(userid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `user Information ${result} not found`));
                return res.status(200).send({
                    result
                      
                    });
            })
            .catch(next);
    })

    //add user
    .post('/user',verifytoken, function (req, res, next) {
        const currentUserName = req.body.username;
        const currentUserPassword = req.body.userpassword;
        const currentUserEmail = req.body.useremail;
        const currentUserAddress = req.body.useraddress;
        const currentUserContactNumber = req.body.usercontactnumber;
        const currentUserRole = req.body.userrole;
        const currentCourseid = req.body.courseid;
        const currentSemester=req.body.semestername
        if (!currentUserEmail) {
            return next(createHttpError(400, "Please provide data"));
        }
        return user.AddUser(currentUserName, currentUserPassword, currentUserEmail, currentUserAddress, currentUserContactNumber, currentUserRole,currentCourseid,currentSemester)
            .then((currentUserName, currentUserPassword, currentUserEmail, currentUserAddress, currentUserContactNumber, currentUserRole,currentCourseid,currentSemester) => res.status(201).json({ currentUserName, currentUserPassword, currentUserEmail, currentUserAddress, currentUserContactNumber,currentUserRole, currentCourseid,currentSemester }))
            .catch(next);

    })


    //update userinfo by userid
    .put('/user/:userid', verifytoken, (req, res, next) => {
        const userid = parseInt(req.params.userid);
        const userpassword = req.body.userpassword;
        const useremail = req.body.useremail;
        const useraddress = req.body.useraddress;
        const usercontactnumber = req.body.usercontactnumber;


        console.log(userid, userpassword, useremail, useraddress, usercontactnumber);
        return user.UpdateUserinfo(userid,  userpassword, useremail, useraddress, usercontactnumber)
            .then((result) => {
                if (!result) return next(createHttpError(404, ` userinfo ${result} not successfully updated`));
                console.log(result.rows);
                return res.json(result.rows).end();
            })
            .catch(next);
    })

    //delete user by id
    .delete('/user/:userid', (req, res, next) => {
        const userid = parseInt(req.params.userid);
        console.log(userid);
        return user.DeleteUser(userid)
            .then((result) => res.status(200).send("Successfully deleted user").end())
            .catch(next);
    })

    //search username for info
    .get('/searchuser/:username', verifytoken, (req, res, next) => {
        const username = (req.params.username)
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
     
                return   res.status(200).send({
                result
                  
                });
            })
            .catch(next);
    })
    //Get course by ID
    .get('/Course/:courseid', (req, res, next) => {
        const courseid = (req.params.courseid)
        return Course.GetCoursebyID(courseid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `Course Information ${result} not found`));
                return res.json(result).end();
            })
            .catch(next);
    })
    //Add Course
    .post('/Course', function (req, res, next) {
        const currentCoursecode = req.body.coursecode;
        const currentCourseName = req.body.coursename;
        const currentCourseabbrev = req.body.courseabbrev;
        if (!currentCoursecode) {
            return next(createHttpError(400, "Please provide data"));
        }
        return Course.AddCourse(currentCoursecode, currentCourseName, currentCourseabbrev)
            .then((currentCoursecode, currentCourseName, currentCourseabbrev) => res.status(201).json({ currentCoursecode, currentCourseName, currentCourseabbrev }))
            .catch(next);

    })
    //Update a Course information
    .put('/Course/:courseid', (req, res, next) => {
        const courseid = parseInt(req.params.courseid);
        const currentCoursecode = req.body.coursecode;
        const currentCourseName = req.body.coursename;
        const currentCourseabbrev = req.body.courseabbrev;

        console.log(courseid, currentCoursecode, currentCourseName, currentCourseabbrev);
        return Course.UpdateCourseinfo(courseid, currentCoursecode, currentCourseName, currentCourseabbrev)
            .then((result) => {
                if (!result) return next(createHttpError(404, ` courseinfo ${result} not successfully updated`));
                console.log(result.rows);
                return res.json(result.rows).end();
            })
            .catch(next);
    })
    //To delete Courseinfo by id 
    .delete('/Course/:courseid', (req, res, next) => {
        const courseid = parseInt(req.params.courseid);
        console.log(courseid);
        return Course.DeleteCourseinfo(courseid)
            .then((result) => res.status(200).send("Successfully deleted CourseInfo").end())
            .catch(next);
    })
    //To get courseinfo by coursecode
    .get('/Courseinfo/:coursecode', (req, res, next) => {
        const currentCoursecode = (req.params.coursecode)
        return Course.GetCoursenamebyCoursecode(currentCoursecode)
            .then((result) => {
                if (!result) return next(createHttpError(404, ` Coursename ${result} not found`));
                console.log(result);
                return res.json(result).end;
            })
            .catch(next);
    })
    //To get courseid by coursename
    .get('/GetCourseid/:coursename', (req, res, next) => {
        const currentCourseName = (req.params.coursename)
        return Course.GetCourseidbyCoursename(currentCourseName)
            .then((result) => {
                if (!result) return next(createHttpError(404, ` Coursename ${result} not found`));
                console.log(result);
                return res.json(result).end;
            })
            .catch(next);
    })
    //Endpoint for Module 
    //Get alll moduleinfo
    .get('/Module', (req, res, next) => {
        return Module.GetAllModule()
            .then((result) => {
                if (!result) return next(createHttpError(404, `Module Information ${result} not found`));
                return   res.status(200).send({
                    result
                      
                    });
            })
            .catch(next);
    })
    //Get  moduleinfo by userid
    .get('/Modulecourse/:courseid', (req, res, next) => {
        const courseid = (req.params.courseid)
        return Module.GetModulewithuserid(courseid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `Module Information ${result} not found`));
                return   res.status(200).send({
                    result
                      
                    });
            })
            .catch(next);
    })
    //Get course by ID
    .get('/Module/:moduleid', (req, res, next) => {
        const moduleid = (req.params.moduleid)
        return Module.GetModulebyID(moduleid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `Module Information ${result} not found`));
                return res.json(result).end();
            })
            .catch(next);
    })
  //get module by userid
    .get('/ModulebyUser/:userid', (req, res, next) => {
        const userid = (req.params.userid)
        return Module.GetModulebyUserID(userid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `Module Information ${result} not found`));
                return   res.status(200).send({
                    result
                      
                    });
            })
            .catch(next);
    })
    //Add Course
    .post('/Module', function (req, res, next) {
        const currentModulecode = req.body.modulecode;
        const currentModuleName = req.body.modulename;
        const currentModuledetail = req.body.moduledetail;
        const currentCourseid = req.body.courseid;
        const currentSemesterName = req.body.semestername;
        if (!currentModulecode) {
            return next(createHttpError(400, "Please provide data"));
        }
        return Module.AddModule(currentModulecode, currentModuleName, currentModuledetail, currentCourseid, currentSemesterName)
            .then((currentModulecode, currentModuleName, currentModuledetail, currentCourseid, currentSemesterName) => res.status(201).json({ currentModulecode, currentModuleName, currentModuledetail, currentCourseid, currentSemesterName }))
            .catch(next);

    })
    //Update a Course information
    .put('/Module/:moduleid', (req, res, next) => {
        const moduleid = parseInt(req.params.moduleid);
        const currentModulecode = req.body.modulecode;
        const currentModuleName = req.body.modulename;
        const currentModuledetail = req.body.moduledetail;
        const currentCourseid = req.body.courseid;
        const currentSemesterName = req.body.semestername;

        console.log(moduleid, currentModulecode, currentModuleName, currentModuledetail, currentCourseid, currentSemesterName);
        return Module.UpdateModuleinfo(moduleid, currentModulecode, currentModuleName, currentModuledetail, currentCourseid, currentSemesterName)
            .then((result) => {
                if (!result) return next(createHttpError(404, ` moduleinfo ${result} not successfully updated`));
                console.log(result.rows);
                return res.json(result.rows).end();
            })
            .catch(next);
    })
    //delete module by id
    .delete('/Module/:moduleid', (req, res, next) => {
        const moduleid = parseInt(req.params.moduleid);
        console.log(moduleid);
        return Module.DeleteModuleinfo(moduleid)
            .then((result) => res.status(200).send("Successfully deleted module").end())
            .catch(next);
    })
    //search modulename for info
    .get('/searchmoduleinfo/:modulename', (req, res, next) => {
        const currentModuleName = (req.params.modulename)
        return Module.SearchModuleinfobymodulename(currentModuleName)
            .then((result) => {
                if (!result) return next(createHttpError(404, ` username ${result} not found`));
                console.log(result);
                return res.json(result).end;
            })
            .catch(next);
    })
    //Get Moduleinfo by courseID
    .get('/Moduleinfo/:courseid', (req, res, next) => {
        const currentCourseid = (req.params.courseid)
        return Module.GetModulebycourseid(currentCourseid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `Module Information ${result} not found`));
                return res.json(result).end();
            })
            .catch(next);
    })
    //End Point Feedback table
    //Get all the feedback
    .get('/Feedback', (req, res, next) => {
        return Feedback.GetAllFeedback()
            .then((result) => {
                if (!result) return next(createHttpError(404, `Feedback Information ${result} not found`));
                return  res.status(200).send({
                    result
                      
                    });
            })
            .catch(next);
    })
    //Get Feedback by ID
    .get('/Feedback/:feedbackid', (req, res, next) => {
        const feedbackid = (req.params.feedbackid)
        return Feedback.GetFeedbackbyID(feedbackid)
            .then((result) => {
                if (!result) return next(createHttpError(404, `Course Information ${result} not found`));
                return res.json(result).end();
            })
            .catch(next);
    })
    //Make Feedback
    .post('/Feedback', function (req, res, next) {
        const currentfeedbacktitle = req.body.feedbacktitle;
        const currentfeedbackcontent = req.body.feedbackcontent;
     
        const currentuserid = req.body.userid;
        if (!currentuserid) {
            return next(createHttpError(400, "Please provide feedback"));
        }
        return Feedback.MakeFeedback(currentfeedbacktitle,currentfeedbackcontent, currentuserid)
            .then((currentfeedbacktitle,currentfeedbackcontent,currentuserid) => res.status(201).json({currentfeedbacktitle, currentfeedbackcontent,currentuserid }))
            .catch(next);

    })
    //delete Feedback by userid
    .delete('/Feedback/:userid/:feedbackid', (req, res, next) => {
        const currentuserid= parseInt(req.params.userid);
        const currentfeedbackid= parseInt(req.params.feedbackid);
        console.log(currentuserid);
        return Feedback.DeleteFeedbackinfo(currentuserid,currentfeedbackid)
            .then((result) => res.status(200).send("Successfully deleted Feedback").end())
            .catch(next);
    })


    .use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)))
    .use((error, req, res, next) => {
        console.error(error);
        next(error);
    })
    .use((error, req, res, next) => next(res.status(error.status || 500).json({ error: error.message || 'Unknown error' })));
