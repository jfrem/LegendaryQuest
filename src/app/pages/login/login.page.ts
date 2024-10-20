// src/app/pages/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }

  async onLogin(): Promise<void> {
    this.loading = true;
    this.errorMessage = ''; // Resetea el mensaje de error

    if (!this.email || !this.password) {
      this.setError('Por favor, completa todos los campos.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      const response = await lastValueFrom(
        this.authService.login(this.email, this.password)
      );

      if (response?.user) {
        this.navCtrl.navigateRoot('/main-game');
      } else {
        this.setError('Respuesta inválida del servidor.');
      }
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.loading = false;
    }
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
  }

  private handleLoginError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.errorMessage =
        error.error?.message || 'Correo o contraseña incorrectos.';
    } else {
      this.errorMessage =
        'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
  }
}
