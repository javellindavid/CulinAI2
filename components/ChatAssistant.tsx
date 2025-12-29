
import React, { useState, useRef, useEffect } from 'react';
import { User, PantryItem, ChatMessage } from '../types';
import { askChef } from '../services/geminiService';

interface ChatAssistantProps {
  user: User;
  pantry: PantryItem[];
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ user, pantry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = `Nama Pengguna: ${user.name}, Alergi: ${user.allergies.join(', ')}. Stok Bahan: ${pantry.map(i => i.name).join(', ')}.`;
      const response = await askChef(input, context);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: response || 'Maaf, saya kurang mengerti pertanyaan tersebut.' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-[2rem] shadow-2xl border border-emerald-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">Chef</div>
              <div>
                <h4 className="font-bold">Asisten CulinAI</h4>
                <p className="text-xs text-emerald-100">Ahli masakan Indonesia</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 mt-10 px-6">"Ada yang bisa saya bantu hari ini? Tanyakan tentang pengganti bahan, tips bumbu, atau menu hari ini!"</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-700 shadow-sm border border-emerald-50 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-50 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              className="flex-grow px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Tanya Chef..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white w-14 h-14 rounded-full shadow-2xl hover:bg-emerald-700 hover:scale-110 transition-all flex items-center justify-center relative group"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="absolute -top-12 right-0 bg-white text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Tanya Chef CulinAI</span>
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
