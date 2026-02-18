import React from 'react';
import { BarChart, Bar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { Page, Activity, Category } from '../types';
import { WEEKDAYS } from '../constants';
import { supabase } from '../services/supabaseClient';

interface DashboardProps {
  navigate: (page: Page, id?: string) => void;
  xp: number;
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ navigate, xp, activities }) => {
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = (xp % 100);

  // 1. Cálculo do Equilíbrio (Radar) baseado no histórico total
  const categories = Object.values(Category);
  const radarData = categories.map(cat => {
    const habitsInCat = activities.filter(a => a.category === cat);
    const totalCompletions = habitsInCat.reduce((sum, a) => sum + (a.history?.length || 0), 0);
    return {
      subject: cat,
      A: habitsInCat.length > 0 ? Math.min(100, (totalCompletions / (habitsInCat.length * 5)) * 100) : 0,
      fullMark: 100
    };
  });

  // 2. Cálculo da Frequência (Barras) dos últimos 7 dias
  const generateWeeklyStats = () => {
    const stats = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayLabel = WEEKDAYS[d.getDay()];
      const count = activities.filter(a => a.history?.includes(iso)).length;
      stats.push({
        day: dayLabel,
        tasks: count,
        isToday: i === 0
      });
    }
    return stats;
  };

  // 3. Cálculo da Evolução de XP (Linha)
  const generateXPFlow = () => {
    const xpByDate: Record<string, number> = {};

    // Mapear ganhos por dia
    activities.forEach(a => {
      (a.history || []).forEach(date => {
        xpByDate[date] = (xpByDate[date] || 0) + a.xp;
      });
    });

    const sortedDates = Object.keys(xpByDate).sort();
    let cumulative = 0;

    // Se não houver histórico, mostrar dados vazios
    if (sortedDates.length === 0) {
      return [{ date: 'Início', xp: 0 }, { date: 'Hoje', xp: xp }];
    }

    // Calcular o XP que existia antes dos registros de histórico (se houver XP manual/extra)
    const totalXpFromHistory = Object.values(xpByDate).reduce((a, b) => a + b, 0);
    const initialXpOffset = Math.max(0, xp - totalXpFromHistory);
    cumulative = initialXpOffset;

    const data = sortedDates.map(date => {
      cumulative += xpByDate[date];
      return {
        date: date.split('-').slice(2).join('/'), // Apenas o Dia DD
        xp: cumulative
      };
    });

    // Limitar aos últimos 10 pontos para não poluir
    return data.length > 10 ? data.slice(-10) : data;
  };

  const realWeeklyStats = generateWeeklyStats();
  const xpEvolutionData = generateXPFlow();

  return (
    <div className="px-6 py-4 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-tighter">Hábito+</h1>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">marque cada conquista e acompanhe seu progresso</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-2 py-1 text-[10px] font-black uppercase text-red-500/50 hover:text-red-500 transition-colors"
          >
            Sair
          </button>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Level</p>
            <p className="text-lg font-black text-primary leading-none">{level}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-icons-round text-primary">emoji_events</span>
          </div>
        </div>
      </header>

      {/* Progress Card */}
      <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Experiência Total</p>
              <h2 className="text-4xl font-black tracking-tighter">{xp} <span className="text-sm font-bold opacity-50">XP</span></h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-primary">{levelProgress}% para o lvl {level + 1}</span>
            </div>
          </div>
          <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary shadow-[0_0_10px_rgba(19,236,146,0.5)] transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full"></div>
      </section>

      {/* XP Evolution Chart (New) */}
      <section className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Crescimento de XP</h3>
          <span className="material-icons-round text-primary text-sm">trending_up</span>
        </div>
        <div className="h-40 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpEvolutionData}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#162d22',
                  border: '1px solid #13ec9233',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#13ec92'
                }}
                itemStyle={{ color: '#13ec92' }}
                labelStyle={{ display: 'none' }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#13ec92"
                strokeWidth={4}
                dot={{ r: 4, fill: '#13ec92', strokeWidth: 2, stroke: '#10221a' }}
                activeDot={{ r: 6, fill: '#13ec92', shadow: '0 0 10px #13ec92' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <section className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Frequência</h3>
            <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">7D</span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={realWeeklyStats}>
                <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                  {realWeeklyStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isToday ? '#13ec92' : '#13ec9233'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-5">
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Equilíbrio</h3>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 6, fontWeight: 800 }} />
                <Radar name="Vida" dataKey="A" stroke="#13ec92" fill="#13ec92" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Habit Manager */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Gerenciar Hábitos ({activities.length})</h2>
          <button onClick={() => navigate(Page.NEW_ACTIVITY)} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-transform"><span className="material-icons-round text-sm">add</span></button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {activities.map(a => (
            <div key={a.id} onClick={() => navigate(Page.CONFIG, a.id)} className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-primary/20 cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-primary group-hover:scale-110 transition-transform" style={{ color: a.color }}>{a.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{a.name}</span>
                  <span className="text-[8px] uppercase font-black text-slate-400 tracking-tighter">{a.history?.length || 0} conclusões totais</span>
                </div>
              </div>
              <span className="material-icons-round text-slate-400 text-sm opacity-30 group-hover:opacity-100 transition-opacity">settings</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;