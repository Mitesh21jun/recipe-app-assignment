import Recipe from '../models/Recipe.js';

const createRecipe = async (req, res) => {
  const { title, ingredients, instructions, cookingTime, imageUrl } = req.body;
  try {
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      imageUrl,
      createdBy: req.user.id
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllRecipes = async (req, res) => {
    const { page = 1, limit = 10, search, ingredient, minCookingTime, maxCookingTime } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (ingredient) filter.ingredients = { $elemMatch: { $regex: ingredient, $options: 'i' } };
    if (minCookingTime || maxCookingTime) {
        filter.cookingTime = {};
        if (minCookingTime) filter.cookingTime.$gte = +minCookingTime;
        if (maxCookingTime) filter.cookingTime.$lte = +maxCookingTime;
    }
    try {
        const recipes = await Recipe.find(filter)
            .skip((page - 1) * limit)
            .limit(+limit)
            .populate('createdBy', 'username');
        const total = await Recipe.countDocuments(filter);
        res.json({ recipes, total, page: +page, limit: +limit });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, ingredients, instructions, cookingTime, imageUrl } = req.body;
    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.imageUrl = imageUrl || recipe.imageUrl;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};
