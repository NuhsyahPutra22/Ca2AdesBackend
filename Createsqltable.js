
const user = `
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    userid SERIAL primary key,
    userName VARCHAR not null,
    userPassword VARCHAR not null,
    userEmail VARCHAR not null,
    userAddress VARCHAR not null,
    userContactNumber VARCHAR not null,
    userRole VARCHAR not null,
    courseid VARCHAR not null
);
`;
module.exports.user = user;