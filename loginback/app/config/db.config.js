module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "password",
    DB: "logintest",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };


//mysql> INSERT INTO roles VALUES (1, 'user', now(), now());
// mysql> INSERT INTO roles VALUES (2, 'moderator', now(), now());
// mysql> INSERT INTO roles VALUES (3, 'admin', now(), now());