   /*Below are SQL Statements used to create tables
    Tables  to create:
    1.User table
    2.course table 



   */
   
 
const CREATE_SchoolManagementSystem_Table = `
DROP TABLE IF EXISTS User CASCADE;
DROP TABLE IF EXISTS Course CASCADE;
DROP TABLE IF EXISTS Module CASCADE



CREATE TABLE IF NOT EXISTS User (
    Userid SERIAL primary key,
    UserName VARCHAR not null,
    UserPassword VARCHAR not null,
    UserEmail VARCHAR not null,
    UserAddress VARCHAR not null,
    UserContactNumber VARCHAR not null,
    UserRole VARCHAR not null,
    Courseid INT UNIQUE,
    CONSTRAINT fk_Course_id FOREIGN KEY(Courseid) REFERENCES Course(Courseid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Course (
    Courseid SERIAL PRIMARY KEY,
    Coursecode VARCHAR(255) UNIQUE NOT NULL,
    CourseName VARCHAR(255) NOT NULL,
    Courseabbrev VARCHAR(255) NOT NULL
    
);
 


`;

module.exports = CREATE_SchoolManagementSystem_Table;
