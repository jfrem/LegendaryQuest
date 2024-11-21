import { Component } from '@angular/core';
import { GameOptions } from '../models/options.interface';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage {
  gameOptions: GameOptions = {
    difficulty: 'medium',
    volume: 50,
    showHints: true,
  };

  saveOptions() {
    console.log('Opciones guardadas:', this.gameOptions);
    // Aquí podrías guardar las opciones en localStorage o enviar a un servidor
  }
}
