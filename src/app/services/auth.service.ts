import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Definición de la interfaz para la respuesta de login
interface LoginResponse {
  message: string;  // Mensaje de respuesta
  user: {          // Información del usuario
    id: string;    // ID del usuario
    username: string; // Nombre de usuario
    email: string; // Correo electrónico del usuario
  };
}

// Decorador que indica que esta clase es un servicio inyectable
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL de la API a la que se realizarán las solicitudes
  private apiUrl = 'http://localhost:8586/proyectos/legendary_quest/public/api';

  // Inyección del HttpClient para realizar solicitudes HTTP
  constructor(private http: HttpClient) {}

  // Método para manejar errores de las solicitudes HTTP
  private handleError(error: any): Observable<never> {
    let errorMsg = 'Ocurrió un error al procesar la solicitud.';

    // Manejo de errores basado en la respuesta del servidor
    if (error.error && error.error.message) {
      errorMsg = error.error.message;
    } else if (error.status === 0) {
      errorMsg = 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.';
    }

    console.error('Ocurrió un error:', errorMsg);
    return throwError(() => new Error(errorMsg)); // Lanzar el error para ser manejado por el suscriptor
  }

  // Método para registrar un nuevo usuario
  register(username: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Establece los headers para la solicitud
    const body = { username, email, password }; // Cuerpo de la solicitud con los datos del usuario

    console.log('😜 Datos de registro:', body); // Log de los datos de registro

    return this.http
      .post(`${this.apiUrl}/register`, body, { headers }) // Realiza la solicitud POST para el registro
      .pipe(catchError(this.handleError)); // Maneja errores en la solicitud
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Establece los headers
    const body = { email, password }; // Cuerpo de la solicitud con las credenciales

    console.log('Enviando solicitud de login:', body); // Log de la solicitud de login

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, body, { headers }) // Realiza la solicitud POST para el login
      .pipe(
        tap((res) => { // Toma la respuesta del login
          console.log('Respuesta de login:', res); // Log de la respuesta
          localStorage.setItem('user', JSON.stringify(res.user)); // Guarda la información del usuario en localStorage
        }),
        catchError(this.handleError) // Maneja errores en la solicitud
      );
  }

  // Método para cerrar sesión
  logout(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Establece los headers
    return this.http
      .post(`${this.apiUrl}/logout/${userId}`, {}, { headers }) // Realiza la solicitud POST para cerrar sesión
      .pipe(
        tap(() => {
          localStorage.removeItem('user'); // Elimina la información del usuario de localStorage
        }),
        catchError(this.handleError) // Maneja errores en la solicitud
      );
  }

  // Método para obtener el ID del usuario almacenado en localStorage
  getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtiene y parsea el usuario desde localStorage
    return user.id || ''; // Devuelve el ID del usuario o una cadena vacía si no existe
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns true si el usuario está autenticado, false en caso contrario.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user'); // Devuelve true si hay un usuario en localStorage, false de lo contrario
  }
}
