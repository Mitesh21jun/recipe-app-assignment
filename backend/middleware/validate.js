import { body, validationResult } from 'express-validator';

export const createRecipeValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('ingredients').isArray({ min: 1 }).withMessage('Ingredients are required'),
  body('instructions').notEmpty().withMessage('Instructions are required'),
  body('cookingTime').notEmpty().withMessage('Cooking time is required')
];

export const updateRecipeValidation = [
  body('title').optional().notEmpty(),
  body('ingredients').optional().isArray({ min: 1 }),
  body('instructions').optional().notEmpty(),
  body('cookingTime').optional().notEmpty()
];

export const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
];

// Helper to merge validation and error handler into one middleware

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const withValidation = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];