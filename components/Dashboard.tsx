
import React from 'react';
import { User } from '../types';

interface DashboardProps {
  user: User;
  pantryCount: number;
  setPage: (p: any) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, pantryCount, setPage, onLogout }) => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Halo, {user.name}! 👋</h2>
          <p className="text-gray-500 italic">"Mari masak hidangan Indonesia yang aman dan lezat hari ini."</p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm border border-emerald-100">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">
             {user.name.charAt(0)}
           </div>
        </div>
      </header>

      <div className="bento-grid">
        {/* Aksi Utama: Scanner */}
        <div 
          onClick={() => setPage('scanner')}
          className="col-span-1 md:col-span-2 row-span-2 bg-emerald-600 text-white p-8 rounded-[2rem] shadow-xl cursor-pointer hover:bg-emerald-700 transition relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-2">Scan Cepat</h3>
            <p className="opacity-90">Analisis bahan & cek alergi instan lewat kamera.</p>
            <div className="mt-8 bg-white/20 w-fit p-4 rounded-2xl backdrop-blur-md">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
        </div>

        {/* Stok Bahan */}
        <div 
          onClick={() => setPage('pantry')}
          className="bg-white p-8 rounded-[2rem] shadow-lg border border-emerald-50 cursor-pointer hover:shadow-xl transition"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">Dapur Pintar</h3>
          <p className="text-gray-500 mb-4">{pantryCount} bahan tersedia</p>
          <div className="flex gap-2">
            <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(pantryCount * 10, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Resep */}
        <div 
          onClick={() => setPage('recipes')}
          className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition"
        >
          <h3 className="text-xl font-bold text-emerald-800 mb-2">Resep AI</h3>
          <p className="text-emerald-600">Saran menu nusantara berdasarkan stok bahan Anda.</p>
        </div>

        {/* Profil Keamanan */}
        <div className="col-span-1 md:col-span-2 bg-red-50 p-8 rounded-[2rem] border border-red-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Profil Keamanan</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.allergies.length > 0 ? (
                  user.allergies.map(a => (
                    <span key={a} className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">{a}</span>
                  ))
                ) : (
                  <span className="text-red-500 italic">Tidak ada alergi terdaftar.</span>
                )}
              </div>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-400">
        <button onClick={onLogout} className="hover:text-emerald-600 transition font-medium">Keluar Akun</button>
      </footer>
    </div>
  );
};

export default Dashboard;
