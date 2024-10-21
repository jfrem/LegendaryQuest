import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onRegister(form: NgForm) {
    this.errorMessage = '';

    if (!this.validateForm(form)) return;

    this.loading = true;

    this.authService.register(this.username, this.email, this.password).pipe(
      catchError((error: any) => {
        this.showError(error.message || 'Error al registrar la cuenta.');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((result) => {
      if (result) {
        this.notificationService.presentToast(
          'Registro exitoso. Por favor, inicia sesión.',
          'success'
        );
        this.router.navigate(['/login']);
      }
    });
  }

  private validateForm(form: NgForm): boolean {
    if (!form.valid) {
      this.showError('Por favor completa todos los campos requeridos.');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.showError('Las contraseñas no coinciden.');
      return false;
    }

    return true;
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.notificationService.presentToast(message, 'danger');
  }
}
