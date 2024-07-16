const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require('../models/db');
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op

// TODO: refactor this later 
const config = require('../config/auth.config');

async function signup(req, res) {
    console.log("authcontroller signup ");
    // Save User to Database
    try {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    if (req.body.roles) {
        const roles = await Role.findAll({
        where: {
            name: {
            [Op.or]: req.body.roles,
            },
        },
        });

        const result = user.setRoles(roles);
        if (result) res.send({ message: "User registered successfully!" });
    } else {
        // user has role = 1
        const result = user.setRoles([1]);
        if (result) res.send({ message: "User registered successfully!" });
    }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
  
async function signin(req, res) {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password!", });
        }

        const token = jwt.sign(
            { id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        req.session.token = token;

        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

async function signout(req, res) {
    try {
        req.session = null;
        return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
        this.next(err);
    }
};

module.exports = {signup, signin, signout}