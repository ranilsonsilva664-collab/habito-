
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
  CONFIG = 'config',
  TREINOS = 'treinos'
}

export type WorkoutLocation = 'Casa' | 'Academia';
export type WorkoutLevel = 'Iniciante' | 'Intermediário';
export type WorkoutGoal = 'Força' | 'Hipertrofia' | 'Resistência' | 'Mobilidade';

export interface Exercise {
  nome: string;
  series: string | number;
  repsOuTempo: string;
  descansoSeg: number;
  dicas: string;
}

export interface Workout {
  id: string;
  nome: string;
  objetivo: WorkoutGoal;
  duracaoMin: number;
  nivel: WorkoutLevel;
  local: WorkoutLocation;
  diasSugeridos: string[];
  exercicios: Exercise[];
}

export interface WorkoutProgram {
  id: string;
  nome: string;
  local: WorkoutLocation;
  nivel: WorkoutLevel;
  diasAtivos: number[]; // 0-6 (Sunday-Saturday)
  rotacao: string[]; // IDs of workouts in order
}

export interface WorkoutHistoryEntry {
  id: string;
  workoutId: string;
  workoutNome: string;
  data: string; // ISO YYYY-MM-DD
  duracaoRealMin: number;
  concluido: boolean;
}

export interface UserWorkoutState {
  programId: string | null;
  history: WorkoutHistoryEntry[];
  lastWorkoutIndex: number;
}
