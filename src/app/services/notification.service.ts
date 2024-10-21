// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastController: ToastController) {}

  /**
   * Muestra un toast con el mensaje y configuración especificados.
   * @param message El mensaje a mostrar en el toast.
   * @param color El color del toast ('success', 'danger', etc.).
   * @param duration La duración del toast en milisegundos.
   */
  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' | 'secondary' = 'success',
    duration: number = 3000
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
