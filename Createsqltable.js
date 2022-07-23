   /*Below are SQL Statements used to create tables
    Tables  to create:
    1.User table
    2.course table 



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
    CONSTRAINT fk_Course_id FOREIGN KEY(Courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE

);

ALTER TABLE usertable
DROP CONSTRAINT fk_Course_id;
DROP TABLE IF EXISTS usertable CASCADE;
DROP TABLE IF EXISTS coursetable CASCADE;





`;

module.exports = CREATE_SchoolManagementSystem_Table;
