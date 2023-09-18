const fs = require('fs');

const tokenStr = fs.readFileSync('.auth');

module.exports = (req, res, next) => {
  const projectBxHeader = req.headers['projectbx'];
  if (projectBxHeader && projectBxHeader === tokenStr) {
    next();
  } else {
    const messageObj = {
      status: 'Error',
      code: -1,
      message: 'Unauthorized',
    };
    res.status(401).json(messageObj);
  }
};
