
import React, { useState, useEffect } from 'react';
import { Page, Activity } from './types';
import { supabase } from './services/supabaseClient';

// Pages
import Dashboard from './pages/Dashboard';
import TodayView from './pages/TodayView';
import WeeklyView from './pages/WeeklyView';
import NewActivity from './pages/NewActivity';
import FocusMode from './pages/FocusMode';
import HabitConfig from './pages/HabitConfig';
import Auth from './pages/Auth';

// Components
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.TODAY);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setActivities([]);
        setXp(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const lastReset = localStorage.getItem(`habito_plus_last_reset_${userId}`);

        let processedActivities = data.map(a => ({
          ...a,
          frequency: a.frequency || [],
          history: a.history || [],
          reminderTimes: a.reminder_times || [],
          remindersEnabled: a.reminders_enabled
        }));

        if (lastReset !== today) {
          processedActivities = processedActivities.map(a => ({ ...a, completed: false }));
          localStorage.setItem(`habito_plus_last_reset_${userId}`, today);
          // Update DB? Probably better to do it lazily or via a separate sync
        }

        setActivities(processedActivities);
        const totalXp = processedActivities.reduce((acc, curr) => acc + (curr.history?.length || 0) * curr.xp, 0);
        setXp(totalXp);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const navigate = (page: Page, habitId?: string) => {
    if (habitId) setSelectedHabitId(habitId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addActivity = async (newActivity: Activity) => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          user_id: session.user.id,
          name: newActivity.name,
          category: newActivity.category,
          icon: newActivity.icon,
          color: newActivity.color,
          time: newActivity.time,
          xp: newActivity.xp,
          frequency: newActivity.frequency,
          reminders_enabled: newActivity.remindersEnabled,
          reminder_times: newActivity.reminderTimes,
          difficulty: newActivity.difficulty
        }])
        .select();

      if (error) throw error;
      if (data) fetchUserData(session.user.id);
      navigate(Page.TODAY);
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };

  const updateActivity = async (updated: Activity) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          name: updated.name,
          category: updated.category,
          icon: updated.icon,
          color: updated.color,
          time: updated.time,
          xp: updated.xp,
          frequency: updated.frequency,
          completed: updated.completed,
          streak: updated.streak,
          history: updated.history,
          reminders_enabled: updated.remindersEnabled,
          reminder_times: updated.reminderTimes,
          difficulty: updated.difficulty
        })
        .eq('id', updated.id);

      if (error) throw error;
      setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
      navigate(Page.DASHBOARD);
    } catch (err) {
      console.error('Error updating activity:', err);
    }
  };

  const deleteActivity = async (id: string) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setActivities(prev => prev.filter(a => a.id !== id));
      navigate(Page.DASHBOARD);
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const activity = activities.find(a => a.id === id);
    if (!activity || !session) return;

    const isCompleting = !activity.completed;
    let newHistory = [...(activity.history || [])];
    let newStreak = activity.streak;

    if (isCompleting) {
      setXp(curr => curr + activity.xp);
      if (!newHistory.includes(today)) {
        newHistory.push(today);
        newStreak += 1;
      }
    } else {
      setXp(curr => Math.max(0, curr - activity.xp));
      if (newHistory.includes(today)) {
        newHistory = newHistory.filter(date => date !== today);
        newStreak = Math.max(0, newStreak - 1);
      }
    }

    const updated = { ...activity, completed: isCompleting, history: newHistory, streak: newStreak };

    setActivities(prev => prev.map(a => a.id === id ? updated : a));

    // Update DB
    await supabase.from('activities').update({
      completed: isCompleting,
      history: newHistory,
      streak: newStreak
    }).eq('id', id);
  };

  const finishSession = (id: string) => {
    // Similar to toggleTaskCompletion but with bonus
    toggleTaskCompletion(id); // Simple version for now
    navigate(Page.TODAY);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth onSuccess={() => { }} />;
  }

  const renderPage = () => {
    const selectedHabit = activities.find(a => a.id === selectedHabitId);

    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard navigate={navigate} xp={xp} activities={activities} />;
      case Page.TODAY:
        return <TodayView activities={activities} toggleTask={toggleTaskCompletion} navigate={navigate} />;
      case Page.WEEKLY:
        return <WeeklyView activities={activities} navigate={navigate} />;
      case Page.NEW_ACTIVITY:
        return <NewActivity onClose={() => navigate(Page.TODAY)} onAdd={addActivity} />;
      case Page.FOCUS_MODE:
        return <FocusMode habit={selectedHabit || activities[0]} onFinish={() => finishSession(selectedHabitId!)} onCancel={() => navigate(Page.TODAY)} />;
      case Page.CONFIG:
        return <HabitConfig habit={selectedHabit || activities[0]} onBack={() => navigate(Page.DASHBOARD)} onUpdate={updateActivity} onDelete={deleteActivity} />;
      default:
        return <TodayView activities={activities} toggleTask={toggleTaskCompletion} navigate={navigate} />;
    }
  };

  const isFullScreenPage = [Page.FOCUS_MODE, Page.NEW_ACTIVITY, Page.CONFIG].includes(currentPage);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex justify-center overflow-x-hidden font-display">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative bg-white dark:bg-background-dark shadow-2xl">
        {!isFullScreenPage && (
          <div className="h-11 w-full flex items-center justify-between px-6 pt-2 select-none shrink-0 z-50 bg-inherit">
            <span className="text-sm font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="material-icons-round text-sm">signal_cellular_alt</span>
              <span className="material-icons-round text-sm">wifi</span>
              <span className="material-icons-round text-sm">battery_full</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="ml-4 text-[10px] font-black uppercase text-red-500/50 hover:text-red-500"
            >
              Sair
            </button>
          </div>
        )}

        <main className={`flex-1 flex flex-col ${isFullScreenPage ? '' : 'pb-24'}`}>
          {renderPage()}
        </main>

        {!isFullScreenPage && (
          <Navigation currentPage={currentPage} navigate={navigate} />
        )}

        {!isFullScreenPage && (
          <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800/10 dark:bg-white/10 rounded-full z-[60]"></div>
        )}
      </div>
    </div>
  );
};

export default App;
