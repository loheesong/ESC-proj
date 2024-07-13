const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Front Page");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Bookings, etc.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in the auth middleware
    const { username, email } = req.body;

    const user = await User.findByPk(userId);
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
};

exports.deleteaccount = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in the auth middleware

    const user = await User.findByPk(userId);
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