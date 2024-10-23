// src/app/pages/register/register.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {}

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onRegister() {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.showError('Por favor completa todos los campos requeridos.');
      return;
    }

    this.loading = true;

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).pipe(
      catchError((error: any) => {
        this.showError(error.message || 'Error al registrar la cuenta.');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(result => {
      if (result) {
        this.notificationService.presentToast('Registro exitoso. Por favor, inicia sesión.', 'success');
        this.router.navigate(['/login']);
      }
    });
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.notificationService.presentToast(message, 'danger');
  }
}
