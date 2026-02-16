
import React from 'react';
import { Category, Activity } from './types';

export const CATEGORIES = [
  { id: Category.CORPO, label: 'Corpo', icon: 'fitness_center' },
  { id: Category.MENTE, label: 'Mente', icon: 'self_improvement' },
  { id: Category.SABER, label: 'Saber', icon: 'menu_book' },
  { id: Category.FOCO, label: 'Foco', icon: 'bolt' },
];

export const COLORS = [
  '#13ec92', // Primary
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#38bdf8', // Sky
];

export const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    name: 'Treino Funcional',
    category: Category.CORPO,
    icon: 'fitness_center',
    color: '#fb923c', // Orange-ish
    time: '07:00 - 08:30',
    xp: 25,
    frequency: ['S', 'T', 'Q', 'Q', 'S'],
    completed: true,
    streak: 5,
    history: []
  },
  {
    id: '2',
    name: 'Leitura Técnica',
    category: Category.SABER,
    icon: 'menu_book',
    color: '#60a5fa', // Blue-ish
    time: '13:00 - 13:30',
    xp: 15,
    frequency: ['S', 'Q', 'S'],
    completed: true,
    streak: 12,
    history: []
  },
  {
    id: '3',
    name: 'Meditação Guiada',
    category: Category.MENTE,
    icon: 'self_improvement',
    color: '#c084fc', // Purple-ish
    time: '21:00 - 21:15',
    xp: 10,
    frequency: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    completed: false,
    streak: 24,
    history: []
  },
  {
    id: '4',
    name: 'Planejamento Semanal',
    category: Category.FOCO,
    icon: 'bolt',
    color: '#34d399', // Emerald
    time: '21:30 - 22:00',
    xp: 20,
    frequency: ['D'],
    completed: false,
    streak: 0,
    history: []
  }
];
