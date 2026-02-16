
export enum Category {
  CORPO = 'Corpo',
  MENTE = 'Mente',
  SABER = 'Saber',
  FOCO = 'Foco',
  OUTROS = 'Outros'
}

export enum Difficulty {
  FACIL = 'Fácil',
  MEDIO = 'Médio',
  DIFICIL = 'Difícil'
}

export interface Activity {
  id: string;
  name: string;
  category: Category;
  icon: string;
  color: string;
  time: string;
  xp: number;
  frequency: string[]; // Days of the week like ['S', 'Q', 'S']
  completed: boolean;
  streak: number;
  history: string[]; // Array of ISO dates (YYYY-MM-DD)
  remindersEnabled?: boolean;
  reminderTimes?: string[]; // Array of "HH:mm"
  difficulty?: Difficulty;
}

export interface DailyStats {
  date: string;
  completedTasks: number;
  totalTasks: number;
  xpEarned: number;
}

export enum Page {
  DASHBOARD = 'dashboard',
  TODAY = 'today',
  WEEKLY = 'weekly',
  NEW_ACTIVITY = 'new_activity',
  FOCUS_MODE = 'focus_mode',
  CONFIG = 'config'
}
