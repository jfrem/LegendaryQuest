// src\app\services\auth.service.ts
// Importaciones necesarias desde Angular y RxJS
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Interfaz que representa la respuesta del servidor al realizar un login.
 */
interface LoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Servicio de autenticación que maneja el registro, inicio de sesión y cierre de sesión de usuarios.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * URL base de la API.
   */
  private apiUrl = 'http://localhost:8586/proyectos/legendary_quest/public/api';

  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP de Angular para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param error - Objeto de error recibido.
   * @returns Observable que emite un error con el mensaje correspondiente.
   */
  private handleError(error: any): Observable<never> {
    let errorMsg = 'Ocurrió un error al procesar la solicitud.';

    if (error.error && error.error.message) {
      // Si el error tiene un mensaje específico, lo utiliza
      errorMsg = error.error.message;
    } else if (error.status === 0) {
      // Si no hay conexión con el servidor
      errorMsg =
        'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.';
    }

    // Imprime el error en la consola para depuración
    console.error('Ocurrió un error:', errorMsg);
    // Retorna un observable que emite un error
    return throwError(() => new Error(errorMsg));
  }

  /**
   * Registra un nuevo usuario.
   * @param username - Nombre de usuario.
   * @param email - Correo electrónico del usuario.
   * @param password - Contraseña.
   * @param passwordConfirmation - Confirmación de la contraseña.
   * @returns Observable con la respuesta de la API.
   */
  register(username: string, email: string, password: string): Observable<any> {
    // Define las cabeceras HTTP
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Crea el cuerpo de la solicitud con los datos de registro
    const body = {
      username,
      email,
      password,
    };

    // Muestra los datos de registro en la consola (útil para depuración)
    console.log('😜 Datos de registro:', body);

    // Realiza la solicitud POST a la API para registrar el usuario
    return this.http.post(`${this.apiUrl}/register`, body, { headers }).pipe(
      // Maneja los posibles errores de la solicitud
      catchError(this.handleError)
    );
  }

  /**
   * Inicia sesión un usuario.
   * @param email - Correo electrónico del usuario.
   * @param password - Contraseña del usuario.
   * @returns Observable con la respuesta de login.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    // Define las cabeceras HTTP
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Crea el cuerpo de la solicitud con las credenciales de login
    const body = { email, password };

    // Muestra la solicitud de login en la consola
    console.log('Enviando solicitud de login:', body);

    // Realiza la solicitud POST a la API para iniciar sesión
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, body, { headers })
      .pipe(
        // Ejecuta acciones adicionales con la respuesta exitosa
        tap((res) => {
          console.log('Respuesta de login:', res);
          // Almacena la información del usuario en el almacenamiento local del navegador
          localStorage.setItem('user', JSON.stringify(res.user));
        }),
        // Maneja los posibles errores de la solicitud
        catchError(this.handleError)
      );
  }

  /**
   * Cierra la sesión de un usuario.
   * @param userId - ID del usuario que desea cerrar sesión.
   * @returns Observable con la respuesta de la API.
   */
  logout(userId: string): Observable<any> {
    // Define las cabeceras HTTP
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // Realiza la solicitud POST a la API para cerrar sesión
    return this.http
      .post(`${this.apiUrl}/logout/${userId}`, {}, { headers })
      .pipe(
        // Ejecuta acciones adicionales después de cerrar sesión
        tap(() => {
          // Elimina la información del usuario del almacenamiento local
          localStorage.removeItem('user');
        }),
        // Maneja los posibles errores de la solicitud
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el ID del usuario almacenado en el almacenamiento local.
   * @returns ID del usuario o una cadena vacía si no está disponible.
   */
  getUserId(): string {
    // Recupera la información del usuario del almacenamiento local
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Retorna el ID del usuario o una cadena vacía si no existe
    return user.id || '';
  }
}
