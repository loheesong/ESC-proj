// handles user login 
const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');
const authJwt = require("../middleware/authJwt");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get("/api/test/all", controller.allAccess);
  
    app.get(
      "/api/test/user",
      [authJwt.verifyToken],
      controller.userBoard
    );
  
    app.get(
      "/api/test/mod",
      [authJwt.verifyToken, authJwt.isModerator],
      controller.moderatorBoard
    );
  
    app.get(
      "/api/test/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      controller.adminBoard
    );
  
    app.put(
      "/api/auth/update-profile",
      [authJwt.verifyToken],
      controller.updateProfile
    );
  
    app.put(
      "/api/auth/deleteaccount",
      [authJwt.verifyToken],
      controller.deleteaccount
    );
  
};