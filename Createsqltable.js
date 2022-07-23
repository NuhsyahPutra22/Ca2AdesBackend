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
    gpacalculation JSON Default '[]'::JSON,
    CONSTRAINT fk_Course_id FOREIGN KEY(courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE

);

create table moduletable(
    moduleid SERIAL primary key,
    modulecode VARCHAR not null,
    modulename VARCHAR not null,
    moduledetail VARCHAR not null,
    courseid INT not null,
    semesterid INT not null,
    CONSTRAINT fk_Courseid FOREIGN KEY(courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_semester_id FOREIGN KEY(semesterid) REFERENCES semestertable(semesterid) ON DELETE CASCADE ON UPDATE CASCADE
)

create table semestertable(
    semesterid SERIAL primary key,
    semestername varchar not null,
    yearforsemester   varchar not null
)

ALTER TABLE usertable
DROP CONSTRAINT fk_Course_id;
DROP TABLE IF EXISTS usertable CASCADE;
DROP TABLE IF EXISTS coursetable CASCADE;





`;

module.exports = CREATE_SchoolManagementSystem_Table;
