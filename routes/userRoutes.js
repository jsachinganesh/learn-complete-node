const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMe',userController.uploadUsersPhoto,userController.resizeUserPhoto,userController.updateMe);
router.patch('/updatePassword',authController.updatePassword);

router.get('/me',userController.getMe,userController.getUser);
router.delete('/deleteMe',userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser); 



module.exports = router;