
import React, { useState, useEffect } from 'react';
import { User, PantryItem, Recipe } from '../types';
import { generateRecipes } from '../services/geminiService';

interface RecipeListProps {
  user: User;
  pantry: PantryItem[];
  onSelectRecipe: (r: Recipe) => void;
  onBack: () => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ user, pantry, onSelectRecipe, onBack }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const pantryNames = pantry.map(i => i.name);
      const results = await generateRecipes(pantryNames, user.allergies);
      setRecipes(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-3xl font-bold">Resep Aman AI</h2>
        </div>
        <button 
          onClick={fetchRecipes}
          className="text-emerald-600 font-semibold flex items-center gap-2 hover:bg-emerald-50 px-4 py-2 rounded-full transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Segarkan
        </button>
      </div>

      <p className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 font-medium text-sm flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
        Filter AI aktif untuk alergi: {user.allergies.length > 0 ? user.allergies.join(', ') : 'Tidak ada alergi'}
      </p>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Sedang meracik ide hidangan nusantara untuk Anda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recipes.map(recipe => (
            <div 
              key={recipe.id} 
              className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group flex flex-col"
            >
              <div className="h-48 bg-emerald-100 relative">
                <img 
                  src={`https://picsum.photos/seed/${recipe.title}/600/400`} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4">
                   <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">{recipe.difficulty}</span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{recipe.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-emerald-700 font-bold">{recipe.cookingTime}</span>
                  <button 
                    onClick={() => onSelectRecipe(recipe)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition"
                  >
                    Masak Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
