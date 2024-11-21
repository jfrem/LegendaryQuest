export interface GameOptions {
  difficulty: 'easy' | 'medium' | 'hard'; // Dificultad del juego
  volume: number; // Volumen del sonido, de 0 a 100
  showHints: boolean; // Indica si se muestran pistas
}
