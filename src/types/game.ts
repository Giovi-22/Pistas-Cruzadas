export type TeamColor = 'red' | 'blue';

export interface Player {
  socketId: string;
  name: string;
  team: TeamColor | null;
}

export interface ClaimedCell {
  row: number;
  col: number;
  team: TeamColor | 'failed';
}

export interface ActiveClue {
  word: string;
  team: TeamColor;
  targetRow: number;
  targetCol: number;
  clueGiverId: string | null;
}

export interface GameConfig {
  rowWords: string[];
  colWords: string[];
  turnDurationSeconds: number;
  maxScore: number;
}

export interface ScoreState {
  red: number;
  blue: number;
}

export interface SecretCoord {
  row: number;
  col: number;
}

export interface Room {
  id: string;
  players: Record<string, Player>;
  config: GameConfig;
  status: 'lobby' | 'playing' | 'finished';
  currentTurn: TeamColor;
  claimedCells: ClaimedCell[];
  activeClue: ActiveClue | null;
  score: ScoreState;
  timerEndTime: number | null;
  availableCoordinates: SecretCoord[];
  winner: TeamColor | null;
}
