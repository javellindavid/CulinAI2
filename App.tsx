
import React, { useState, useEffect, useCallback } from 'react';
import { User, PantryItem, Recipe, ChatMessage } from './types';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Pantry from './components/Pantry';
import RecipeList from './components/RecipeList';
import KitchenMode from './components/KitchenMode';
import ChatAssistant from './components/ChatAssistant';

type Page = 'login' | 'register' | 'dashboard' | 'scanner' | 'pantry' | 'recipes' | 'kitchen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('login');
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Initialize data
  useEffect(() => {
    const savedUser = localStorage.getItem('culinai_user');
    const savedPantry = localStorage.getItem('culinai_pantry');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
    
    if (savedPantry) {
      setPantry(JSON.parse(savedPantry));
    }
  }, []);

  // Persist pantry
  useEffect(() => {
    localStorage.setItem('culinai_pantry', JSON.stringify(pantry));
  }, [pantry]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('culinai_user', JSON.stringify(u));
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('culinai_user');
    setPage('login');
  };

  const handleRegisterSuccess = () => {
    setPage('login');
    alert('Pendaftaran berhasil! Silakan masuk dengan email dan kata sandi Anda.');
  };

  const addToPantry = (item: Omit<PantryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setPantry(prev => [...prev, newItem]);
  };

  const removeFromPantry = (id: string) => {
    setPantry(prev => prev.filter(item => item.id !== id));
  };

  const syncPantryAfterCooking = (ingredientsUsed: string[]) => {
    setPantry(prev => {
      return prev.map(item => {
        const isUsed = ingredientsUsed.some(ing => 
          ing.toLowerCase().includes(item.name.toLowerCase()) || 
          item.name.toLowerCase().includes(ing.toLowerCase())
        );
        if (isUsed) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const renderPage = () => {
    if (!user && page !== 'register') return <Login onLogin={handleLogin} onGoToRegister={() => setPage('register')} />;
    if (page === 'register') return <Register onRegisterSuccess={handleRegisterSuccess} onGoToLogin={() => setPage('login')} />;

    switch (page) {
      case 'dashboard':
        return <Dashboard user={user!} pantryCount={pantry.length} setPage={setPage} onLogout={handleLogout} />;
      case 'scanner':
        return <Scanner user={user!} onAddItems={addToPantry} onBack={() => setPage('dashboard')} />;
      case 'pantry':
        return <Pantry items={pantry} onRemove={removeFromPantry} onAdd={addToPantry} onBack={() => setPage('dashboard')} />;
      case 'recipes':
        return <RecipeList user={user!} pantry={pantry} onSelectRecipe={(r) => { setActiveRecipe(r); setPage('kitchen'); }} onBack={() => setPage('dashboard')} />;
      case 'kitchen':
        return <KitchenMode recipe={activeRecipe!} onFinish={(ings) => { syncPantryAfterCooking(ings); setPage('dashboard'); }} onBack={() => setPage('recipes')} />;
      default:
        return <Dashboard user={user!} pantryCount={pantry.length} setPage={setPage} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      {user && <ChatAssistant user={user} pantry={pantry} />}
    </div>
  );
};

export default App;
