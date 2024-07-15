const db = require('../models/db');
const ROLES = db.ROLES
const User = db.User

async function checkDuplicateUsernameOrEmail(req, res, next) {
    try {
        // Username
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (user) {
            return res.status(400).send({ message: "Failed! Username is already in use!" });
        }

        // Email
        user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }
        next();
    } catch (error) {
        return res.status(500).send({ message: "Unable to validate Username!" });
    }
};
  
function checkRolesExisted(req, res, next) {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }
    next();
};

module.exports = { checkDuplicateUsernameOrEmail, checkRolesExisted };