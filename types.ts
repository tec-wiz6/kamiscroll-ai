
export enum Genre {
  SCHOOL = 'school',
  ROMANCE = 'romance',
  DARK_FANTASY = 'dark fantasy',
  ISEKAI = 'isekai',
  HORROR = 'horror',
  COMEDY = 'comedy'
}

export enum Tone {
  GOOFY = 'goofy',
  SERIOUS = 'serious',
  EDGY = 'edgy',
  EMOTIONAL = 'emotional'
}

export enum TwistIntensity {
  LIGHT = 'light twist',
  BIG_BETRAYAL = 'big betrayal',
  TIME_LOOP = 'time loop',
  DEATH = 'death'
}

export interface Character {
  name: string;
  appearance: string;
  personality: string;
  role: string;
}

export interface Panel {
  id: string;
  visualPrompt: string;
  dialogue: string;
  sfx: string;
  narration?: string;
  imageUrl?: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
}

export interface Page {
  id: string;
  pageNumber: number;
  panels: Panel[];
}

export interface ManhwaStory {
  title: string;
  plot: string;
  characters: Character[];
  pages: Page[];
  twistMoment: string;
}

export interface AppState {
  prompt: string;
  genre: Genre;
  tone: Tone;
  pageCount: number;
  panelsPerPage: number;
  twistIntensity: TwistIntensity;
}
