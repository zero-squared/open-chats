import express from 'express';

import authController from '../controllers/api/authController.js';
import userController from '../controllers/api/userController.js';
import chatController from '../controllers/api/chatController.js';
import messageController from '../controllers/api/messageController.js';
import localizationController from '../controllers/api/localizationController.js';
import labelController from '../controllers/api/labelController.js';
import { uploadSingleImage } from '../middleware/multerUpload.js';
import { canUpdateUser, isGuest, isAdmin, isAuthenticated, canDeleteMessageMw, canEditMessageMw, isNotBlocked } from '../middleware/user.js';

const router = express.Router();

router.get('/users/', isAdmin, userController.getUsers);
router.get('/users/:id', isAuthenticated, userController.getUser);
router.patch('/users/:id', canUpdateUser, userController.updateUser);
router.post('/users/:id/avatar', canUpdateUser, uploadSingleImage, userController.updateAvatar);
router.delete('/users/:id/avatar', canUpdateUser, userController.deleteAvatar);
router.patch('/users/:id/role', isAdmin, userController.updateRole);

router.patch('/users/:id/label', isAuthenticated, labelController.changeLabel);

router.post('/auth/login', isGuest, authController.loginUser);
router.post('/auth/register', isGuest, authController.registerUser);
router.patch('/auth/password', isAuthenticated, authController.changePassword);

router.get('/chats/', chatController.getChats);
router.post('/chats/', isAdmin, chatController.createChat);
router.patch('/chats/:id', isAdmin, chatController.updateChat);
router.delete('/chats/:id', isAdmin, chatController.deleteChat);

router.post('/chats/:id/send', isNotBlocked, messageController.sendMessage);
router.get('/chats/:id/messages', messageController.getMessages);
router.patch('/chats/:chatId/messages/:id', canEditMessageMw, messageController.editMessage);
router.delete('/chats/:chatId/messages/:id', canDeleteMessageMw, messageController.deleteMessage);

router.get('/localization', localizationController.getLocalization);

export default router;