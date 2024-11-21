export interface Game {
  id: string; // ID del juego
  name: string; // Nombre del juego
  description?: string; // Descripción opcional del juego
  difficulty?: string; // Dificultad del juego (fácil, medio, difícil)
}
