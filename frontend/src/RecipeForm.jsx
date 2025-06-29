import { useState } from 'react';


export default function RecipeForm({ initialData = {}, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  const [cookingTime, setCookingTime] = useState(initialData.cookingTime || '');
  const [instructions, setInstructions] = useState(initialData.instructions || '');
  const [ingredients, setIngredients] = useState(
    Array.isArray(initialData.ingredients)
      ? initialData.ingredients.join(', ')
      : initialData.ingredients || ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !cookingTime || !instructions || !ingredients) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onSubmit({
      title,
      imageUrl,
      cookingTime,
      instructions,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)', marginBottom: 24 }}>{submitLabel || 'Recipe'}</h2>
      {error && <div className="error" style={{ color: '#ff4d4f', marginBottom: 8 }}>{error}</div>}
      <label>Title</label>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label>Image URL</label>
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <label>Cooking Time (min)</label>
      <input
        type="number"
        placeholder="Cooking Time (min)"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        required
      />
      <label>Ingredients</label>
      <input
        type="text"
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />
      <label>Instructions</label>
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        required
        rows={5}
        style={{ resize: 'vertical' }}
      />
      <button type="submit">{submitLabel || 'Save'}</button>
    </form>
  );
}
