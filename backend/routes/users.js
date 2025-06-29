
import express from 'express';
import { registerValidation, loginValidation, withValidation } from '../middleware/validate.js';
import userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', ...withValidation(registerValidation), userController.register);
router.post('/login', ...withValidation(loginValidation), userController.login);
router.get('/my-recipes', auth, userController.getMyRecipes);

export default router;
