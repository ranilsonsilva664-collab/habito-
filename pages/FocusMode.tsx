
import React, { useState, useEffect } from 'react';
import { Activity } from '../types';

interface FocusModeProps {
  habit: Activity;
  onFinish: () => void;
  onCancel: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ habit, onFinish, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(1500); // Default 25 min em segundos
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((1500 - timeLeft) / 1500) * 100;

  return (
    <div className="relative min-h-screen bg-background-dark text-white flex flex-col items-center justify-between p-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden">
        <div className={`w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] transition-transform duration-[1000ms] ${isActive ? 'scale-150' : 'scale-100'}`}></div>
      </div>

      <header className="w-full flex justify-between items-center pt-6 opacity-60">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-white/5"><span className="material-icons-round text-xl">close</span></button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mb-1">Foco Ativo</span>
          <h1 className="text-sm font-bold tracking-wide">{habit.name}</h1>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="relative group cursor-pointer" onClick={() => setIsActive(!isActive)}>
          <div className="text-[120px] font-black tracking-tighter tabular-nums leading-none select-none transition-all duration-300">
            {formatTime(timeLeft)}
          </div>
          <div className="absolute -bottom-10 left-0 right-0 text-center">
             <span className="text-[10px] tracking-[0.3em] uppercase font-black text-primary/60 animate-pulse">
                {isActive ? 'Concentrando...' : 'Toque para iniciar'}
             </span>
          </div>
        </div>
        
        <div className="mt-24 w-full max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary shadow-[0_0_15px_rgba(19,236,146,0.5)] transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </main>

      <footer className="w-full max-w-sm pb-8 space-y-6">
        <button 
          onClick={onFinish}
          className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span className="tracking-widest uppercase text-sm">FINALIZAR SESSÃO</span>
          <span className="material-icons-round">bolt</span>
        </button>
        <p className="text-[10px] text-center italic opacity-30 uppercase tracking-[0.2em]">
          "A constância vence o talento."
        </p>
      </footer>
    </div>
  );
};

export default FocusMode;
