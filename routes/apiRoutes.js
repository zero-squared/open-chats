import express from 'express';

import authController from '../controllers/api/authController.js';
import userController from '../controllers/api/userController.js';
import chatController from '../controllers/api/chatController.js';
import messageController from '../controllers/api/messageController.js';
import { uploadSingleImage } from '../middleware/multerUpload.js';
import { canUpdateUser, isGuest, isAdmin, isAuthenticated } from '../middleware/user.js';

const router = express.Router();

router.get('/users/', isAdmin, userController.getUsers);
router.get('/users/:id', isAuthenticated, userController.getUser);
router.patch('/users/:id', canUpdateUser, userController.updateUser);
router.post('/users/:id/avatar', canUpdateUser, uploadSingleImage, userController.updateAvatar);
router.delete('/users/:id/avatar', canUpdateUser, userController.deleteAvatar);
router.patch('/users/:id/role', isAdmin, userController.updateRole);

router.post('/auth/login', isGuest, authController.loginUser);
router.post('/auth/register', isGuest, authController.registerUser);
router.patch('/auth/password', isAuthenticated, authController.changePassword);

router.get('/chats/', chatController.getChats);
router.get('/chats/:id/messages', chatController.getMessages);
router.post('/chats/:id/send', isAuthenticated, messageController.sendMessage);

export default router;