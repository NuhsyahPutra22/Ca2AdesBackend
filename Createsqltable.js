   /*Below are SQL Statements used to create tables
    Tables  to create:
    1.User table
    2.course table 
    3.moduletable 
    4.feedbacktable
    5. quiz table



   */
   
 
const CREATE_SchoolManagementSystem_Table = ` 


create table  coursetable (
    Courseid SERIAL PRIMARY KEY,
    Coursecode VARCHAR(255) UNIQUE NOT NULL,
    CourseName VARCHAR(255) NOT NULL,
    Courseabbrev VARCHAR(255) NOT NULL    
);

create table usertable (
    Userid SERIAL primary key,
    UserName VARCHAR not null,
    UserPassword VARCHAR not null,
    UserEmail VARCHAR not null,
    UserAddress VARCHAR not null,
    UserContactNumber VARCHAR not null,
    UserRole VARCHAR not null,
    Courseid INT not null,
    gpacalculation JSON Default '[]'::JSON,
    CONSTRAINT fk_Course_id FOREIGN KEY(courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE

);

create table moduletable(
    moduleid SERIAL primary key,
    modulecode VARCHAR not null,
    modulename VARCHAR not null,
    moduledetail VARCHAR not null,
    courseid INT not null,
    semestername varchar not null,
    CONSTRAINT fk_Courseid FOREIGN KEY(courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE
)

create table feedbacktable (
    feedbackid SERIAL primary key,
    feedbackcontent VARCHAR not null,
    feedbackdate  DATE not null DEFAULT NOW(),
    userid INT not null,
    CONSTRAINT fk_userid FOREIGN KEY(userid) REFERENCES usertable(userid) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE quiztable (
    quizid SERIAL primary key,
    q1 VARCHAR not null,
    q2 VARCHAR not null,
    q3 VARCHAR not null,
    q4 VARCHAR not null,
    q5 VARCHAR not null,
    q6 VARCHAR not null,
    q7 VARCHAR not null,
    userid INT not null,
    CONSTRAINT fk_Userid FOREIGN KEY(userid) REFERENCES usertable(Userid) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE usertable
DROP CONSTRAINT fk_Course_id;

ALTER TABLE moduletable
DROP CONSTRAINT fk_Courseid;

ALTER TABLE feedbacktable
DROP CONSTRAINT fk_userid;

ALTER TABLE quiztable
DROP CONSTRAINT fk_userid;

DROP TABLE IF EXISTS coursetable CASCADE;
DROP TABLE IF EXISTS usertetable CASCADE;
DROP TABLE IF EXISTS feedbaable CASCADE;
DROP TABLE IF EXISTS moduletable CASCADE;
DROP TABLE IF EXISTS quiztable CASCADE;



`;

module.exports = CREATE_SchoolManagementSystem_Table;
