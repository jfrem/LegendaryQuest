import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  onRegister(form: NgForm) {
    if (!form.valid) {
      this.setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.setError('Las contraseñas no coinciden.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .register(this.username, this.email, this.password)
      .pipe(
        catchError((error: any) => {
          this.setError(error.message || 'Error al registrar la cuenta.');
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result) => {
        if (result) {
          this.presentToast('Registro exitoso. Por favor, inicia sesión.', 'success');
          this.router.navigate(['/login']);
        }
      });
  }

  private setError(message: string) {
    this.errorMessage = message;
    this.presentToast(message, 'danger');
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      buttons: [{ text: 'Cerrar', role: 'cancel' }],
    });
    toast.present();
  }
}
