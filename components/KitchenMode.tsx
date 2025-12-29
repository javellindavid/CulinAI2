
import React from 'react';
import { Recipe } from '../types';

interface KitchenModeProps {
  recipe: Recipe;
  onFinish: (ingredients: string[]) => void;
  onBack: () => void;
}

const KitchenMode: React.FC<KitchenModeProps> = ({ recipe, onFinish, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{recipe.title}</h2>
        </div>
        <button 
          onClick={() => onFinish(recipe.ingredients)}
          className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
        >
          Selesai Memasak
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bento Bahan */}
        <div className="md:col-span-1 bg-white p-8 rounded-[2rem] shadow-lg border border-emerald-50 h-fit">
          <h3 className="text-xl font-bold mb-6 text-emerald-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Bahan-bahan
          </h3>
          <ul className="space-y-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1.5 w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-gray-700 text-sm md:text-base">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bento Instruksi */}
        <div className="md:col-span-2 bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
          <h3 className="text-xl font-bold mb-8 text-emerald-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Langkah Memasak
          </h3>
          <div className="space-y-10">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 text-lg leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenMode;
