// src/app/pages/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { catchError, finalize, of, Observable } from 'rxjs';

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
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  async onLogin(form: NgForm): Promise<void> {
    this.resetErrorMessage();

    if (!this.isFormValid(form)) return;

    this.loading = true;

    this.authService.login(this.email, this.password)
      .pipe(
        catchError((error) => this.handleLoginError(error)),
        finalize(() => this.loading = false)
      )
      .subscribe(response => this.handleLoginResponse(response));
  }

  private isFormValid(form: NgForm): boolean {
    if (!form.valid) {
      this.showError('Por favor, completa todos los campos requeridos.');
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.showError('Por favor, ingresa un correo electrónico válido.');
      return false;
    }

    return true;
  }

  private handleLoginError(error: any): Observable<any> { 
    const message = error.status === 401
      ? 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.'
      : error.message || 'Error en el inicio de sesión.';
    
    this.showError(message);
    return of(null); 
  }

  private handleLoginResponse(response: any): void {
    if (response?.user) {
      this.notificationService.presentToast('Bienvenido a la sala de juego.', 'success');
      this.router.navigate(['/main-game']);
    } else {
      this.showError('Respuesta inválida del servidor.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.notificationService.presentToast(message, 'danger');
  }

  private resetErrorMessage(): void {
    this.errorMessage = '';
  }
}
