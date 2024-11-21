import { Component } from '@angular/core';
import { Game } from '../models/game.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage {
  Game: Game = {
    id: '', // ID del juego
    name: '', // Nombre del juego
    description: '', // Descripción opcional del juego
    difficulty: '', // Dificultad del juego (fácil, medio, difícil)
  };
  startGame() {
    console.log('El juego ha comenzado', this.Game);
    // la lógica del juego
  }
}
