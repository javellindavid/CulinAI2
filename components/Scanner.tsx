
import React, { useRef, useState, useEffect } from 'react';
import { User, PantryItem } from '../types';
import { detailedFoodAnalysis } from '../services/geminiService';

interface ScannerProps {
  user: User;
  onAddItems: (item: Omit<PantryItem, 'id'>) => void;
  onBack: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ user, onAddItems, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const processImage = async (base64: string) => {
    setScanning(true);
    setResult(null);
    try {
      const analysis = await detailedFoodAnalysis(base64, user.allergies);
      setResult(analysis);
    } catch (err) {
      alert("Gagal menganalisis gambar. Silakan coba lagi.");
    } finally {
      setScanning(false);
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg');
    const base64 = dataUrl.split(',')[1];
    await processImage(base64);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      await processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-bold">Pemindai Makanan Pintar</h2>
      </div>

      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-black aspect-video flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute inset-0 border-[3px] border-white/30 m-8 rounded-2xl pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
        </div>

        {scanning && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-xl">Chef AI sedang menganalisis...</p>
            <p className="text-emerald-200 text-sm">Mengidentifikasi menu, kalori & keamanan.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={captureAndScan}
          disabled={scanning}
          className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-emerald-700 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Scan Langsung
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-emerald-50 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Unggah Foto Makanan
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Kartu Header: Ringkasan Hasil */}
          <div className={`p-8 rounded-[2.5rem] shadow-xl border-2 ${result.containsAllergens ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1 block">Hasil Analisis</span>
                <h3 className="text-4xl font-bold text-gray-800 capitalize">{result.dishName}</h3>
                <div className="flex gap-4 mt-4">
                  <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-emerald-100">
                    <p className="text-xs text-gray-400">Estimasi Kalori</p>
                    <p className="text-xl font-bold text-emerald-600">{result.calories} kkal</p>
                  </div>
                </div>
              </div>
              {result.containsAllergens && (
                <div className="bg-red-500 text-white p-6 rounded-[2rem] shadow-lg max-w-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span className="font-bold">PERINGATAN ALERGI</span>
                  </div>
                  <p className="text-sm opacity-90">{result.allergenDetails}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Tips Kesehatan */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-50">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Tips Sehat
              </h4>
              <ul className="space-y-4">
                {result.healthTips.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bento Resep */}
            <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-50">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Resep Cepat: {result.recipe.title}
                </h4>
                <div className="flex gap-4 text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{result.recipe.cookingTime}</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{result.recipe.difficulty}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-3">Bahan-bahan</h5>
                  <ul className="space-y-2">
                    {result.recipe.ingredients.map((ing: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-3">Instruksi</h5>
                  <div className="space-y-3">
                    {result.recipe.instructions.map((step: string, i: number) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-bold text-emerald-600 mr-2">{i + 1}.</span> {step}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
