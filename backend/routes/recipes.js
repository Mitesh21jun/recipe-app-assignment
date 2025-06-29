import express from 'express';
import { createRecipeValidation, updateRecipeValidation, withValidation } from '../middleware/validate.js';
import recipeController from '../controllers/recipeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, ...withValidation(createRecipeValidation), recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', auth, ...withValidation(updateRecipeValidation), recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);

export default router;
