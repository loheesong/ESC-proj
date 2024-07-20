const db = require("../models");
const User = db.user;

checkDuplicateUsername = async (req, res, next) => {
  try {
    // Username
    let oguser = await User.findOne({
      where: {
        username: req.body.oldname
      }
    });

    let ogname = oguser.username;
    let ogmail = oguser.email;

    let newuser = await User.findOne({
      where:{
        username: req.body.username
      }
    });

    if (newuser && newuser.username == ogname && newuser.email == ogmail){//If user of that name is found and both name + email is same - No changes were made
      return res.status(400).send({
        message: "No changes made"
      });
    }

    if (newuser && newuser.email != ogmail && newuser.username != ogname) {//If user of that name is found but the name is changed AND email is changed - means username is already taken 
      return res.status(400).send({
        message: "Failed. Username is already in use."
      });
    } 

    newuser = await User.findOne({
      where:{
        email: req.body.email
      }
    });

    if (newuser && newuser.email != ogmail && newuser.username != ogname) {// If user of that email is found but name is changed AND email is changed - Email is already taken
      return res.status(400).send({
        message: "Failed. Email is already in use."
      });
    } 

    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Username!"
    });
  }
};


const verifyEdit = {
  checkDuplicateUsername
};

module.exports = verifyEdit;
