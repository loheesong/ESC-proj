// handles user login 
const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
});

router.get("/api/test/all", controller.allAccess);

router.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
);

router.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
);

router.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
);

router.put(
    "/api/auth/update-profile",
    [authJwt.verifyToken],
    controller.updateProfile
);

router.put(
    "/api/auth/deleteaccount",
    [authJwt.verifyToken],
    controller.deleteaccount
);

module.exports = router