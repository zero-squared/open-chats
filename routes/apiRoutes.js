import express from 'express';

import authController from '../controllers/api/authController.js';
import { uploadSingleImage } from '../middleware/multerUpload.js';
import { canUpdateUser, isGuest, isAdmin } from '../middleware/user.js';
import userController from '../controllers/api/userController.js';
import chatController from '../controllers/api/chatController.js';

const router = express.Router();

router.get('/users/', isAdmin, userController.getUsers);
router.patch('/users/:id', canUpdateUser, userController.updateUser);
router.post('/users/:id/avatar', canUpdateUser, uploadSingleImage, userController.updateAvatar);
router.delete('/users/:id/avatar', canUpdateUser, userController.deleteAvatar);

router.post('/auth/login', isGuest, authController.loginUser);
router.post('/auth/register', isGuest, authController.registerUser);

router.get('/chats/', chatController.getChats);
router.get('/chats/:id/messages', chatController.getMessages);

export default router;