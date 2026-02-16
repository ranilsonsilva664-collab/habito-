
import React, { useState, useEffect, useRef } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, onClose }) => {
  const [hour, setHour] = useState(value.split(':')[0] || '08');
  const [minute, setMinute] = useState(value.split(':')[1] || '00');
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
    onChange(`${hour}:${minute}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-dark/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-card-dark w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/10 animate-in zoom-in-95 duration-300">
        <header className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Selecione o Horário</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </header>

        <div className="flex justify-center items-center py-10 gap-8">
          {/* Hours Scroll */}
          <div className="flex flex-col items-center">
             <span className="text-[8px] font-black uppercase text-slate-400 mb-4 tracking-widest">Hora</span>
             <div className="h-48 overflow-y-auto no-scrollbar snap-y snap-mandatory px-4 flex flex-col gap-2">
               {hours.map(h => (
                 <button 
                   key={h} 
                   onClick={() => setHour(h)}
                   className={`h-12 w-12 flex items-center justify-center rounded-2xl text-xl font-black transition-all snap-center ${hour === h ? 'bg-primary text-background-dark scale-110 shadow-lg' : 'text-slate-300 dark:text-slate-700 hover:text-primary/50'}`}
                 >
                   {h}
                 </button>
               ))}
             </div>
          </div>

          <div className="text-3xl font-black text-slate-200 dark:text-slate-800 self-center mt-6">:</div>

          {/* Minutes Scroll */}
          <div className="flex flex-col items-center">
             <span className="text-[8px] font-black uppercase text-slate-400 mb-4 tracking-widest">Min</span>
             <div className="h-48 overflow-y-auto no-scrollbar snap-y snap-mandatory px-4 flex flex-col gap-2">
               {minutes.map(m => (
                 <button 
                   key={m} 
                   onClick={() => setMinute(m)}
                   className={`h-12 w-12 flex items-center justify-center rounded-2xl text-xl font-black transition-all snap-center ${minute === m ? 'bg-primary text-background-dark scale-110 shadow-lg' : 'text-slate-300 dark:text-slate-700 hover:text-primary/50'}`}
                 >
                   {m}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <footer className="p-6 bg-slate-50 dark:bg-black/20 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 h-14 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-500 font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="flex-1 h-14 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            Confirmar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TimePicker;
