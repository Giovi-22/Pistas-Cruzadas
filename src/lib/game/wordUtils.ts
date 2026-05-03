import { BIBLIA, NATURALEZA, DEPORTES, GENERAL, MATRIMONIOS } from './wordDictionary';

type WordItem = {
    word: string;
    group: string;
};

export function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

/**
 * Selección inteligente de palabras evitando repetición de grupo semántico
 */
export function getSmartWords(words: WordItem[], count: number = 10): WordItem[] {
  const shuffled = shuffle(words);

  const result: WordItem[] = [];
  const usedGroups = new Set<string>();

  // 1️⃣ Prioridad: no repetir grupos
  for (const item of shuffled) {
    if (!usedGroups.has(item.group)) {
      result.push(item);
      usedGroups.add(item.group);
    }

    if (result.length === count) return result;
  }

  // 2️⃣ Fallback: completar aunque repita grupo
  for (const item of shuffled) {
    if (!result.find(r => r.word === item.word)) {
      result.push(item);
    }

    if (result.length === count) break;
  }

  return result;
}

/**
 * Generador de tablero formateado para el estado del juego
 */
export function generateSmartBoard(categoryName: string) {
  let pool: WordItem[] = [];

  switch (categoryName.toUpperCase()) {
    case 'BIBLIA': pool = BIBLIA; break;
    case 'NATURALEZA': pool = NATURALEZA; break;
    case 'DEPORTES': pool = DEPORTES; break;
    case 'MATRIMONIOS': pool = MATRIMONIOS; break;
    default: pool = GENERAL; break;
  }

  const selected = getSmartWords(pool, 10);

  return {
    rows: selected.slice(0, 5).map(w => w.word),
    cols: selected.slice(5, 10).map(w => w.word)
  };
}
