const router = require('express').Router();
const { authenticate } = require('../controller/authController');
const profileController = require('../controller/profileController');

router.get('/:id', authenticate, profileController.getProfileById);
router.put('/:id', authenticate, profileController.updateProfile);

module.exports = router;
