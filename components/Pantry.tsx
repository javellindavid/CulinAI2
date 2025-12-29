
import React, { useState } from 'react';
import { PantryItem, ExpiryStatus } from '../types';

interface PantryProps {
  items: PantryItem[];
  onRemove: (id: string) => void;
  onAdd: (item: Omit<PantryItem, 'id'>) => void;
  onBack: () => void;
}

const Pantry: React.FC<PantryProps> = ({ items, onRemove, onAdd, onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'pcs', expiryDate: '' });

  const getStatus = (date: string): ExpiryStatus => {
    const today = new Date();
    const exp = new Date(date);
    const diff = exp.getTime() - today.getTime();
    const days = diff / (1000 * 3600 * 24);

    if (days < 0) return ExpiryStatus.EXPIRED;
    if (days < 3) return ExpiryStatus.WARNING;
    return ExpiryStatus.FRESH;
  };

  const getStatusColor = (status: ExpiryStatus) => {
    switch (status) {
      case ExpiryStatus.EXPIRED: return 'bg-red-500';
      case ExpiryStatus.WARNING: return 'bg-yellow-500';
      case ExpiryStatus.FRESH: return 'bg-emerald-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-3xl font-bold">Dapur Pintar</h2>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition"
        >
          {showAddForm ? 'Tutup' : '+ Tambah Bahan'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-50 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4 text-emerald-800">Tambah Inventaris Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              placeholder="Nama Bahan (misal: Telur)" 
              className="px-4 py-2 border rounded-xl"
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Jumlah" 
              className="px-4 py-2 border rounded-xl"
              value={newItem.quantity}
              onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
            />
            <input 
              type="date" 
              className="px-4 py-2 border rounded-xl"
              value={newItem.expiryDate}
              onChange={e => setNewItem({...newItem, expiryDate: e.target.value})}
            />
            <button 
              onClick={() => {
                if (newItem.name && newItem.expiryDate) {
                  onAdd(newItem);
                  setNewItem({ name: '', quantity: 1, unit: 'pcs', expiryDate: '' });
                  setShowAddForm(false);
                }
              }}
              className="bg-emerald-100 text-emerald-700 font-bold py-2 rounded-xl hover:bg-emerald-200 transition"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
            <p className="text-xl">Dapur Anda kosong.</p>
            <p>Scan bahan atau tambah secara manual untuk mulai.</p>
          </div>
        ) : (
          items.map(item => {
            const status = getStatus(item.expiryDate);
            return (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 capitalize">{item.name}</h4>
                    <p className="text-gray-500">{item.quantity} {item.unit}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-sm">
                    <p className="text-gray-400">Kadaluarsa:</p>
                    <p className={`font-semibold ${status === ExpiryStatus.EXPIRED ? 'text-red-500' : 'text-gray-700'}`}>{item.expiryDate}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Pantry;
