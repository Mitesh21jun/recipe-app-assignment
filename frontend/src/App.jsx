// Login and Register wrappers
const Login = () => <LoginForm />;
const Register = () => <RegisterForm />;



import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ProtectedRoute from './ProtectedRoute';
import { getAllRecipes, getRecipe, getMyRecipes, createRecipe, updateRecipe, deleteRecipe } from './api';
import RecipeCard from './RecipeCard';



// Home Page: List all recipes (paginated)

import { FaSearch } from 'react-icons/fa';
import { useRef } from 'react';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const searchTimeout = useRef();
  const searchInputRef = useRef();
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      getAllRecipes(page, limit, search)
        .then(res => {
          setRecipes(res.data.recipes || res.data);
          setLoading(false);
          // Restore focus to search input after results update
          if (searchInputRef.current) searchInputRef.current.focus();
        })
        .catch(() => {
          setError('Failed to load recipes');
          setLoading(false);
        });
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [page, search]);

  return (
    <main className="container">
      <div className="card center" style={{ flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <h1 style={{ fontWeight: 700, fontSize: '2.2rem', color: 'var(--primary-dark)', margin: 0 }}>Discover & Share Amazing Recipes</h1>
        <form className="center" style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: '2rem', boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.08)', padding: '0.5rem 1rem' }} onSubmit={e => e.preventDefault()}>
          <FaSearch style={{ color: 'var(--primary)', fontSize: '1.3rem', marginRight: '0.7rem' }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search recipes by name or ingredient..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search recipes"
            autoComplete="off"
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '1.1rem', padding: '0.7rem 0.5rem', outline: 'none', color: 'var(--text-main)' }}
          />
        </form>
      </div>
      <h2>All Recipes</h2>
      {loading ? (
        <div className="center" style={{ minHeight: 120 }}><p>Loading recipes...</p></div>
      ) : error ? (
        <div className="center" style={{ minHeight: 120 }}><p>{error}</p></div>
      ) : (
        <>
          <div className="center" style={{ flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id || recipe.id} recipe={recipe} onClick={() => navigate(`/recipes/${recipe._id || recipe.id}`)} />
            ))}
          </div>
          <div className="center" style={{ margin: '1.5rem 0', gap: 16 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span style={{ color: 'var(--accent)', fontWeight: 500, fontSize: 16 }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={recipes.length < limit}>Next</button>
          </div>
        </>
      )}
    </main>
  );
};

// Recipe Detail Page
const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getRecipe(id)
      .then(res => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load recipe');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <main>
      <div className="card" style={{ maxWidth: 600, margin: '2.5rem auto' }}>
        <h2 style={{ color: 'var(--primary-dark)', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>{recipe.title}</h2>
        <img src={recipe.imageUrl || '/vite.svg'} alt={recipe.title} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12, marginBottom: 18, border: '1.5px solid var(--border)' }} />
        <p style={{ color: 'var(--accent)', fontWeight: 500, fontSize: 16, marginBottom: 8 }}><b>Cooking Time:</b> {recipe.cookingTime} min</p>
        <p style={{ color: 'var(--primary-dark)', fontWeight: 500, fontSize: 16, marginBottom: 8 }}><b>Ingredients:</b> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
        <p style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: 16, marginBottom: 0 }}><b>Instructions:</b> {recipe.instructions}</p>
      </div>
    </main>
  );
};


import { useAuthStore } from './stores/authStore';

import RecipeForm from './RecipeForm';

// My Recipes Page (Protected)
const MyRecipes = () => {
  const token = useAuthStore(s => s.token);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getMyRecipes(token)
      .then(res => {
        setRecipes(res.data.recipes || res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load your recipes');
        setLoading(false);
      });
  }, [token, refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id, token);
      setRefresh(r => !r);
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return <p>Loading your recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="container center" style={{ flexDirection: 'column', minHeight: '60vh' }}>
      <h2>My Recipes</h2>
      <button onClick={() => navigate('/add-recipe')}>Add Recipe</button>
      <div className="center" style={{ flexWrap: 'wrap', gap: '2rem', marginTop: '2rem', width: '100%' }}>
        {recipes.map(recipe => (
          <div key={recipe._id || recipe.id} style={{ position: 'relative' }}>
            <RecipeCard recipe={recipe} onClick={() => navigate(`/edit-recipe/${recipe._id || recipe.id}`)} />
            <button style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleDelete(recipe._id || recipe.id)}>Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
};
// Add Recipe Page (Protected)
const AddRecipe = () => {
  const token = useAuthStore(s => s.token);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const handleSubmit = async (data) => {
    try {
      await createRecipe(data, token);
      navigate('/my-recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add recipe');
    }
  };
  return (
    <main className="container center" style={{ flexDirection: 'column', minHeight: '60vh' }}>
      <RecipeForm onSubmit={handleSubmit} submitLabel="Add Recipe" />
      {error && <div className="error">{error}</div>}
    </main>
  );
};

// Edit Recipe Page (Protected)
const EditRecipe = () => {
  const token = useAuthStore(s => s.token);
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getRecipe(id)
      .then(res => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load recipe');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await updateRecipe(id, data, token);
      navigate('/my-recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recipe');
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <RecipeForm initialData={recipe} onSubmit={handleSubmit} submitLabel="Update Recipe" />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-recipes" element={
          <ProtectedRoute>
            <MyRecipes />
          </ProtectedRoute>
        } />
        <Route path="/add-recipe" element={
          <ProtectedRoute>
            <AddRecipe />
          </ProtectedRoute>
        } />
        <Route path="/edit-recipe/:id" element={
          <ProtectedRoute>
            <EditRecipe />
          </ProtectedRoute>
        } />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
