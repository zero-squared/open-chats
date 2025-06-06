import express from 'express';

import authController from '../controllers/api/authController.js';
import { uploadSingleImage } from '../middleware/multerUpload.js';
import { canUpdateUser, isGuest, isAdmin } from '../middleware/user.js';
import userController from '../controllers/api/userController.js';

const router = express.Router();

router.post('/users/:id/avatar', canUpdateUser, uploadSingleImage, userController.updateAvatar);
router.get('/users/', isAdmin, userController.getUsers);

router.post('/auth/login', isGuest, authController.loginUser);
router.post('/auth/register', isGuest, authController.registerUser);

export default router;