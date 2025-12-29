
import React, { useState } from 'react';
import { User } from '../../types';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

const COMMON_ALLERGIES = ['Kacang', 'Susu/Tenusu', 'Gluten', 'Makanan Seafood', 'Telur', 'Kedelai', 'Kerang', 'MSG'];

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('culinai_all_users') || '[]');
    
    if (users.some((u: User) => u.email === email)) {
      alert('Email sudah terdaftar. Silakan gunakan email lain.');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      allergies: selectedAllergies
    };

    users.push(newUser);
    localStorage.setItem('culinai_all_users', JSON.stringify(users));
    onRegisterSuccess();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-emerald-50 mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-600 mb-2">Gabung CulinAI</h1>
        <p className="text-gray-500">Masak Aman & Nyaman</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alergi (Profil Keamanan Pribadi)</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGIES.map(allergy => (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleAllergy(allergy)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedAllergies.includes(allergy)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          Buat Akun
        </button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={onGoToLogin} className="text-emerald-600 font-semibold hover:underline">
          Kembali ke Masuk
        </button>
      </div>
    </div>
  );
};

export default Register;
