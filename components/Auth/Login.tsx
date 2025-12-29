
import React, { useState } from 'react';
import { User } from '../../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('culinai_all_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Email atau kata sandi salah');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-emerald-50 mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-600 mb-2">CulinAI</h1>
        <p className="text-gray-500">Asisten Dapur Pintar Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="chef@culinai.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          Masuk
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <button onClick={onGoToRegister} className="text-emerald-600 font-semibold hover:underline">
            Daftar Sekarang
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
