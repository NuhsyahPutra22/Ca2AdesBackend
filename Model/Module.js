const createHttpError = require('http-errors');
const { query, POSTGRES_ERROR_CODE } = require("../Database");

const module_table = 'moduletable';
module.exports.module_table = module_table;

const Module_table_sql = `
    CREATE TABLE ${module_table} (
        moduleid SERIAL primary key,
        modulecode VARCHAR not null,
        modulename VARCHAR not null,
        moduledetail VARCHAR not null,
        courseid INT not null,
        semestername varchar not null,
        CONSTRAINT fk_Courseid FOREIGN KEY(courseid) REFERENCES coursetable(Courseid) ON DELETE CASCADE ON UPDATE CASCADE
        
    );
`;
module.exports.Module_table_sql = Module_table_sql;

//Get all Module
module.exports.GetAllModule = function get() {
    return query(`SELECT m.*,c.coursename FROM ${module_table} m inner join coursetable c on c.courseid=m.courseid`,[])
.then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        const modulelist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const module = result.rows[i];
          modulelist.push({
          
            moduleid:module.moduleid,
            modulecode:module.modulecode,
            modulename:module.modulename,
            moduledetail:module.moduledetail,
           courseid:module.coursename,
           semestername:module.semestername
          });
        }
        console.log(modulelist)
        return(modulelist);
    });
};

module.exports.GetModulewithuserid = function get(courseid) {
    return query(`SELECT m.* FROM moduletable m inner join usertable  a on  m.courseid=$1 `,[courseid])
    .then((result) => {
        if  (!result.rows.length) return null;
        const modulelist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const module = result.rows[i];
          modulelist.push({
          

            modulecode:module.modulecode,
            modulename:module.modulename,
            moduledetail:module.moduledetail
           
          });
        }
        console.log(modulelist)
        return(modulelist)
    });
};

//Get Module by ID
module.exports.GetModulebyID = function get(moduleid) {
    console.log(moduleid);
    return query(`SELECT * FROM ${module_table} where moduleid=$1`,[moduleid])
    .then((result) => {
        if  (!result.rows.length) return null;
      
        const modulelist = [];
        for (let i = 0; i < result.rows.length; i++) {
          const module = result.rows[i];
          modulelist.push({
          
            moduleid:module.moduleid,
            modulecode:module.modulecode,
            modulename:module.modulename,
            moduledetail:module.moduledetail
            
           
          });
        }
        console.log(modulelist)
        return(modulelist)
    });
};
//get module by userid
module.exports.GetModulebyUserID = function get(userid) {

    return query(`select * from usertable a inner join moduletable b on a.courseid=b.courseid and a.semestername=b.semestername where userid=$1`,[userid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
// Add Module
module.exports.AddModule = function add(currentModulecode, currentModuleName,currentModuledetail,currentCourseid,currentSemesterName) {
    return query(`INSERT INTO ${module_table}(modulecode,modulename,moduledetail,courseid,semestername) VALUES($1,$2,$3,$4,$5) RETURNING *`, [
        currentModulecode,
        currentModuleName,
        currentModuledetail,
        currentCourseid,
        currentSemesterName
    ])
        .then((response) => response.rows[0].currentModulecode)
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, `modulecode ${currentModulecode} already exists`);
            } else throw error; // unexpected error
        });
};
//To update the all the Moduletable info
module.exports.UpdateModuleinfo=function add(moduleid,currentModulecode, currentModuleName,currentModuledetail) {
    return query(`UPDATE ${module_table} SET modulecode = $2,modulename = $3,moduledetail = $4 where moduleid = $1  RETURNING *` , [moduleid,currentModulecode, currentModuleName,currentModuledetail])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};
//To delete Moduleinfobyid

module.exports.DeleteModuleinfo= function get(moduleid) {
    return query(`DELETE FROM ${module_table} where moduleid= $1`,[moduleid]).then((result) => {
        if (!result.rows.length) return null;
        return result;
    });

};
//To get Moduleinfo by modulename
module.exports.SearchModuleinfobymodulename=function SearchModuleinfobymodulename(currentModuleName) {
    console.log(currentModuleName)
    return query(`SELECT * From ${module_table} where modulename=$1`,[currentModuleName])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};
//To get Moduleinfo by modulename
module.exports.SearchModuleinfobymodulename=function SearchModuleinfobymodulename(currentModuleName) {
    console.log(currentModuleName)
    return query(`SELECT * From ${module_table} where modulename=$1`,[currentModuleName])
	.then((result) => {
        if (!result.rows) return null;
        return result.rows;
    });
};
//Get Moduleinfo by courseID
module.exports.GetModulebycourseid = function get(currentCourseid) {
    console.log(currentCourseid);
    return query(`SELECT * FROM ${module_table} where courseid=$1`,[currentCourseid])
    .then((result) => {
        if  (!result.rows.length) return null;
        console.log(result.rows);
        return (result.rows);
    });
};

