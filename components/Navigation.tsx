
import React from 'react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, navigate }) => {
  const tabs = [
    { page: Page.TODAY, label: 'Hoje', icon: 'today' },
    { page: Page.WEEKLY, label: 'Semana', icon: 'calendar_view_week' },
    { page: Page.DASHBOARD, label: 'Progresso', icon: 'bar_chart' },
    { page: Page.CONFIG, label: 'Ajustes', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 h-20 px-8 flex items-center justify-between z-50">
      <button
        onClick={() => navigate(Page.TODAY)}
        className={`flex flex-col items-center gap-1 ${currentPage === Page.TODAY ? 'text-primary' : 'text-slate-400'}`}
      >
        <span className="material-icons-round">today</span>
        <span className="text-[10px] font-medium uppercase">Hoje</span>
      </button>

      <button
        onClick={() => navigate(Page.WEEKLY)}
        className={`flex flex-col items-center gap-1 ${currentPage === Page.WEEKLY ? 'text-primary' : 'text-slate-400'}`}
      >
        <span className="material-icons-round">calendar_view_week</span>
        <span className="text-[10px] font-medium uppercase">Semana</span>
      </button>

      <div className="relative -top-6">
        <button
          onClick={() => navigate(Page.NEW_ACTIVITY)}
          className="w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform"
        >
          <span className="material-icons-round text-background-dark text-3xl">add</span>
        </button>
      </div>

      <button
        onClick={() => navigate(Page.DASHBOARD)}
        className={`flex flex-col items-center gap-1 ${currentPage === Page.DASHBOARD ? 'text-primary' : 'text-slate-400'}`}
      >
        <span className="material-icons-round">bar_chart</span>
        <span className="text-[10px] font-medium uppercase">Progresso</span>
      </button>

      <button
        onClick={() => navigate(Page.CONFIG)}
        className={`flex flex-col items-center gap-1 ${currentPage === Page.CONFIG ? 'text-primary' : 'text-slate-400'}`}
      >
        <span className="material-icons-round">settings</span>
        <span className="text-[10px] font-medium uppercase">Ajustes</span>
      </button>
    </nav>
  );
};

export default Navigation;
