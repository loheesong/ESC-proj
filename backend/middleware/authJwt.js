const jwt = require("jsonwebtoken");
const db = require('../models/db');
const User = db.User

function verifyToken(req, res, next){
    let token = req.session.token;
  
    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }
  
    jwt.verify(token,
               process.env.AUTH_SECRET,
               (err, decoded) => {
                if (err) {
                  return res.status(401).send({
                    message: "Unauthorized!",
                  });
                }
                req.userId = decoded.id;
                next();
               });
  };
  
async function isAdmin(req, res, next) {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }

        return res.status(403).send({ message: "Require Admin Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate User role!" });
    }
};

async function isModerator(req, res, next) {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }

        return res.status(403).send({ message: "Require Moderator Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate Moderator role!" });
    }
};

async function isModeratorOrAdmin(req, res, next) {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
            if (roles[i].name === "admin") {
                return next();
            }
        }

        return res.status(403).send({ message: "Require Moderator or Admin Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate Moderator or Admin role!" });
    }
};

module.exports = { verifyToken, isAdmin, isModerator, isModeratorOrAdmin};