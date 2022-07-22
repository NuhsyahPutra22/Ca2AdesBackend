const express = require('express');
const cors = require('cors');
const bodyParser=require('body-parser');
const createHttpError = require('http-errors');
var isLoggedInMiddleWare=require('../auth/verifytoken');
const{login2}=require('../Model/user');
const { query } = require('../database');

module.exports = express()
    .use(cors())
    .use(express.json())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))


.post('/login',(req,res,next)=>{
    const UserName = req.body.UserName;
    const UserPassword = req.body.UserPassword;
    if(!UserPassword) {
        if (!UserPassword) return next(createHttpError(404, ` password not found`));

    }
    return login2(UserName,UserPassword)
    .then(login2(UserName,UserPassword,(error,user)=>{
        if (error) {
            res.status(500).send();
            return;
        }
        if (user === null) {
            res.status(401).send();
            return;
        }
        const payload = {
            UserName: user.UserName,
            UserPassword: user.UserPassword
        };
        jwt.sign(
            // (1) payload
            payload,
            // (2) Secret key 
            JWT_SECRET,
            // (3) Signing Algorithm 
            { algorithm: "HS256" },
            // (4) response handle (callback function)
            (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                }
                res.status(200).send({
                    token: token,
                    UserName: user.UserName
                });
            })
    })
)})




.use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)))
.use((error, req, res, next) => {
    console.error(error);
    next(error);
})
.use((error, req, res, next) => next(res.status(error.status || 500).json({ error: error.message || 'Unknown error' })));
