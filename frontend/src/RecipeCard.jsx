


export default function RecipeCard({ recipe, onClick }) {
  return (
    <div className="card" style={{ width: 320, cursor: 'pointer', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'stretch', transition: 'box-shadow 0.2s' }} onClick={onClick}>
      <img
        src={recipe.imageUrl || recipe.image || '/vite.svg'}
        alt={recipe.title}
        style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}
      />
      <div style={{ padding: '1.2rem 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>{recipe.title}</h3>
        <p style={{ color: 'var(--accent)', fontWeight: 500, margin: 0 }}>Cooking Time: {recipe.cookingTime} min</p>
      </div>
    </div>
  );
}
