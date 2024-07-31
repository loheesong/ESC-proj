const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
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
    console.error('Signup error:', error); // Add this line
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    console.log("teststest"+req.body.username)
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id },
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
    console.error('Signin error:', error);
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};

exports.update = async (req, res) => {
  try{
    const updatedAccount = await User.update(
      {username: req.body.username, email: req.body.email},
      {
      where: {username: req.body.oldname},
      returning: true
      }
    );

    if (!updatedAccount) {
      console.log('Account not found');
      return null;
    }

    console.log('Updated account:', updatedAccount);
    res.send({message: "Account Updated. Logging Out"})
  }
  catch(err){
    return res.status(500).send({ message: err.message });
  }
};

/*exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    const { username, email } = req.body;

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.status(200).send({ message: "Profile updated successfully. Log Out to update changes" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while updating the profile." });
  }
};*/

exports.deleteaccount = async (req, res) => {
  try {
    const user = await User.findOne({
        where: {
          username: req.body.username,
        },
      });

    console.log(user)
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    await user.destroy();

    res.status(200).send({ message: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred while deleting the account." });
  }
};