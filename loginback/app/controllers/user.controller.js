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
