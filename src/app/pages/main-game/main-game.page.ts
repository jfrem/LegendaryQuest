// src/app/pages/main-game/main-game.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.page.html',
  styleUrls: ['./main-game.page.scss'],
})
export class MainGamePage implements OnInit {
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  startGame() {
    console.log('Juego iniciado');
    // Navegar a la página del juego
    // this.navCtrl.navigateForward('/game');
  }

  showOptions() {
    console.log('Mostrar instrucciones');
    // Implementa la lógica para mostrar un modal con opciones
  }

  logout() {
    this.loading = true;
    const userId = this.authService.getUserId();

    this.authService.logout(userId).subscribe({
      next: (res) => {
        console.log('Sesión cerrada', res);
        this.navCtrl.navigateRoot('/login');
        this.presentToast('Sesión cerrada exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        this.presentToast('Error al cerrar sesión', 'danger');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
