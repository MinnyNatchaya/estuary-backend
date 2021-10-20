const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer')) {
      return res.status(401).json({ message: 'you are unauthorized' });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'you are unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: 'you are unauthorized' });
    }

    req.user = user;
    req.data = decoded;
    next();
  } catch (err) {
    console.log(err.name);
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { username, password, confirmPassword, email, birthDate, role } = req.body;
    if (password !== confirmPassword) {
      throw new CustomError('password and confirm password did not match', 400);
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hasedPassword,
      email,
      birthDate,
      role: 'CLIENT'
    });
    res.status(200).json({ message: 'Your account has been created' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(400).json({ messageUsername: 'Invalid username' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ messagePassword: 'Invalid password' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 * 24 });

    res.json({ message: 'login success', token });
  } catch (err) {
    next(err);
  }
};