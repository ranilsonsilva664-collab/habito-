import { Workout } from '../types';

export const workouts: Workout[] = [
    // --- CASA: INICIANTE ---
    {
        id: 'casa-a-ini',
        nome: 'Casa - Treino A (Corpo Todo)',
        objetivo: 'Resistência',
        duracaoMin: 25,
        nivel: 'Iniciante',
        local: 'Casa',
        diasSugeridos: ['Segunda'],
        exercicios: [
            { nome: 'Polichinelos', series: 1, repsOuTempo: '2 min', descansoSeg: 30, dicas: 'Aquecimento cardio' },
            { nome: 'Mobilidade Ombro/Quadril', series: 1, repsOuTempo: '2 min', descansoSeg: 0, dicas: 'Movimente em círculos' },
            { nome: 'Agachamento Livre', series: 3, repsOuTempo: '12-15', descansoSeg: 60, dicas: 'Mantenha as costas retas' },
            { nome: 'Flexão de Braços (Joelhos)', series: 3, repsOuTempo: '8-12', descansoSeg: 60, dicas: 'Cotovelos a 45 graus' },
            { nome: 'Remada com Toalha', series: 3, repsOuTempo: '10-15', descansoSeg: 60, dicas: 'Puxe contra a resistência da toalha' },
            { nome: 'Prancha', series: 3, repsOuTempo: '30-45s', descansoSeg: 60, dicas: 'Core contraído' },
            { nome: 'Alongamento Final', series: 1, repsOuTempo: '3 min', descansoSeg: 0, dicas: 'Relaxe a musculatura' }
        ]
    },
    {
        id: 'casa-b-ini',
        nome: 'Casa - Treino B (Pernas + Core)',
        objetivo: 'Hipertrofia',
        duracaoMin: 25,
        nivel: 'Iniciante',
        local: 'Casa',
        diasSugeridos: ['Quarta'],
        exercicios: [
            { nome: 'Afundo Alternado', series: 3, repsOuTempo: '10-12 cada', descansoSeg: 60, dicas: 'Joelho de trás quase encosta no chão' },
            { nome: 'Elevação Pélvica', series: 3, repsOuTempo: '12-15', descansoSeg: 60, dicas: 'Contraia o glúteo no topo' },
            { nome: 'Panturrilha em pé', series: 3, repsOuTempo: '15-20', descansoSeg: 45, dicas: 'Amplitude máxima' },
            { nome: 'Abdominal Bicicleta', series: 3, repsOuTempo: '20-30', descansoSeg: 60, dicas: 'Giro controlado do tronco' },
            { nome: 'Prancha Lateral', series: 2, repsOuTempo: '20-30s cada', descansoSeg: 45, dicas: 'Quadril alto' }
        ]
    },
    {
        id: 'casa-c-ini',
        nome: 'Casa - Treino C (Upper + Cardio)',
        objetivo: 'Resistência',
        duracaoMin: 25,
        nivel: 'Iniciante',
        local: 'Casa',
        diasSugeridos: ['Sexta'],
        exercicios: [
            { nome: 'Flexão de Braços', series: 3, repsOuTempo: '8-12', descansoSeg: 60, dicas: 'Mantenha o corpo alinhado' },
            { nome: 'Pike Push-up', series: 3, repsOuTempo: '8-12', descansoSeg: 60, dicas: 'Foco nos ombros' },
            { nome: 'Remada Curvada (Garrafas)', series: 3, repsOuTempo: '10-15', descansoSeg: 60, dicas: 'Esmague as escápulas' },
            { nome: 'Corrida Estacionária', series: 6, repsOuTempo: '30s', descansoSeg: 30, dicas: 'Finisher: Intensidade alta' },
            { nome: 'Alongamento', series: 1, repsOuTempo: '5 min', descansoSeg: 0, dicas: 'Foco em membros superiores' }
        ]
    },
    {
        id: 'casa-mob-ini',
        nome: 'Mobilidade Express',
        objetivo: 'Mobilidade',
        duracaoMin: 15,
        nivel: 'Iniciante',
        local: 'Casa',
        diasSugeridos: ['Terça', 'Quinta'],
        exercicios: [
            { nome: 'Gato-Vaca', series: 1, repsOuTempo: '2 min', descansoSeg: 0, dicas: 'Mobilidade de coluna' },
            { nome: 'Abertura de Quadril', series: 2, repsOuTempo: '1 min cada', descansoSeg: 15, dicas: 'Posição do corredor' },
            { nome: 'Mobilidade Torácica', series: 2, repsOuTempo: '12-15 reps', descansoSeg: 15, dicas: 'Giro no chão' },
            { nome: 'Criança (Alongamento)', series: 1, repsOuTempo: '2 min', descansoSeg: 0, dicas: 'Respire fundo' }
        ]
    },
    // --- ACADEMIA: INICIANTE ---
    {
        id: 'acad-u1-ini',
        nome: 'Academia - Upper 1',
        objetivo: 'Força',
        duracaoMin: 45,
        nivel: 'Iniciante',
        local: 'Academia',
        diasSugeridos: ['Segunda'],
        exercicios: [
            { nome: 'Supino Reto (Halter ou Barra)', series: 3, repsOuTempo: '6-10', descansoSeg: 90, dicas: 'Foco no peitoral' },
            { nome: 'Puxada Aberta (Pulldown)', series: 3, repsOuTempo: '8-12', descansoSeg: 90, dicas: 'Desça até o peito' },
            { nome: 'Desenvolvimento c/ Halteres', series: 3, repsOuTempo: '8-12', descansoSeg: 90, dicas: 'Coluna apoiada no banco' },
            { nome: 'Remada Baixa', series: 3, repsOuTempo: '8-12', descansoSeg: 90, dicas: 'Cotovelos rentes ao corpo' },
            { nome: 'Rosca Direta c/ Halteres', series: 2, repsOuTempo: '10-15', descansoSeg: 60, dicas: 'Sem balançar o corpo' },
            { nome: 'Tríceps Polia', series: 2, repsOuTempo: '10-15', descansoSeg: 60, dicas: 'Estenda totalmente o braço' }
        ]
    },
    {
        id: 'acad-l1-ini',
        nome: 'Academia - Lower 1',
        objetivo: 'Força',
        duracaoMin: 45,
        nivel: 'Iniciante',
        local: 'Academia',
        diasSugeridos: ['Terça'],
        exercicios: [
            { nome: 'Agachamento Livre (Barra)', series: 3, repsOuTempo: '6-10', descansoSeg: 120, dicas: 'Core ativo' },
            { nome: 'Leg Press 45', series: 3, repsOuTempo: '10-15', descansoSeg: 90, dicas: 'Pés largura dos ombros' },
            { nome: 'Mesa Flexora', series: 3, repsOuTempo: '10-15', descansoSeg: 90, dicas: 'Foco em posterior' },
            { nome: 'Panturrilha no Leg Press', series: 3, repsOuTempo: '12-20', descansoSeg: 60, dicas: 'Carga moderada' },
            { nome: 'Prancha Abdominal', series: 3, repsOuTempo: '30-60s', descansoSeg: 60, dicas: 'Corpo reto' }
        ]
    },
    {
        id: 'acad-u2-ini',
        nome: 'Academia - Upper 2',
        objetivo: 'Hipertrofia',
        duracaoMin: 45,
        nivel: 'Iniciante',
        local: 'Academia',
        diasSugeridos: ['Quinta'],
        exercicios: [
            { nome: 'Supino Inclinado c/ Halteres', series: 3, repsOuTempo: '8-12', descansoSeg: 90, dicas: 'Foco em peitoral superior' },
            { nome: 'Remada Curvada', series: 3, repsOuTempo: '8-12', descansoSeg: 90, dicas: 'Puxe em direção ao umbigo' },
            { nome: 'Elevação Lateral', series: 3, repsOuTempo: '12-15', descansoSeg: 60, dicas: 'Braços levemente flexionados' },
            { nome: 'Face Pull', series: 3, repsOuTempo: '12-15', descansoSeg: 60, dicas: 'Foco em deltoide posterior' },
            { nome: 'Rosca Martelo', series: 2, repsOuTempo: '10-12', descansoSeg: 60, dicas: 'Pegada neutra' },
            { nome: 'Tríceps Testa', series: 2, repsOuTempo: '10-12', descansoSeg: 60, dicas: 'Cuidado com os cotovelos' }
        ]
    },
    {
        id: 'acad-l2-ini',
        nome: 'Academia - Lower 2',
        objetivo: 'Hipertrofia',
        duracaoMin: 45,
        nivel: 'Iniciante',
        local: 'Academia',
        diasSugeridos: ['Sexta'],
        exercicios: [
            { nome: 'Levantamento Terra (Sumô ou Trad)', series: 3, repsOuTempo: '6-10', descansoSeg: 120, dicas: 'Foco em posterior e glúteos' },
            { nome: 'Cadeira Extensora', series: 3, repsOuTempo: '12-15', descansoSeg: 90, dicas: 'Finalize o movimento' },
            { nome: 'Cadeira Abdutora', series: 3, repsOuTempo: '15-20', descansoSeg: 60, dicas: 'Postura ereta' },
            { nome: 'Panturrilha Sentado', series: 3, repsOuTempo: '15-20', descansoSeg: 60, dicas: 'Explosão na subida' },
            { nome: 'Abdominal Infra', series: 3, repsOuTempo: '12-15', descansoSeg: 60, dicas: 'Controle a descida' }
        ]
    },
    // ... (Remaining workouts for Intermediate could follow similar pattern)
];

export const programs: WorkoutProgram[] = [
    {
        id: 'prog-casa-ini',
        nome: 'Casa Iniciante 3x',
        local: 'Casa',
        nivel: 'Iniciante',
        diasAtivos: [1, 3, 5], // Seg, Qua, Sex
        rotacao: ['casa-a-ini', 'casa-b-ini', 'casa-c-ini']
    },
    {
        id: 'prog-acad-ini',
        nome: 'Academia Iniciante 4x',
        local: 'Academia',
        nivel: 'Iniciante',
        diasAtivos: [1, 2, 4, 5], // Seg, Ter, Qui, Sex
        rotacao: ['acad-u1-ini', 'acad-l1-ini', 'acad-u2-ini', 'acad-l2-ini']
    }
];
