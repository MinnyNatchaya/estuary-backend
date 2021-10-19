module.exports = (err, req, res, next) => {
  console.log(err);

  let code;
  let message;

  if (err.name === 'SequelizeValidationError') {
    code = 400;
  }
  console.log(err.name);
  if (err.name === 'SequelizeUniqueConstraintError') {
    code = 400;
    message = 'Username is already in use.';
  }

  if (err.name === 'JsonWebTokenError') {
    code = 401;
  }

  if (err.name === 'TokenExpiredError') {
    code = 401;
  }
  res.status(code || err.code || 500).json({ message: message || err.message });
};
