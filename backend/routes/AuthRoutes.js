// handles auth for login 
const verifySignUp = require('../middleware/verifySignUp');
const AuthController = require('../controllers/AuthController');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
      "/api/auth/signup",
      [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
      ],
      AuthController.signup
    );
  
    app.post("/api/auth/signin", AuthController.signin);
  
    app.post("/api/auth/signout", AuthController.signout);
  };