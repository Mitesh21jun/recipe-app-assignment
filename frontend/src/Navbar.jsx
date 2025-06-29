import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

export default function Navbar() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="navbar container" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card-bg)', borderRadius: '1.5rem', boxShadow: 'var(--shadow)', padding: '1.2rem 2rem' }}>
      <span className="logo" style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary-dark)' }}>🍲 RecipeApp</span>
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/my-recipes">My Recipes</Link>
            <Link to="/add-recipe">Add Recipe</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
