import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// Definición de la interfaz para los usuarios
interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  address: string;
  rol: string;
  imagen: string;
}

/**
 * AuthService gestiona la autenticación de usuarios, incluyendo el inicio de sesión, cierre de sesión y almacenamiento de datos de usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'app/data/usuarios.json'; // URL para obtener los datos de usuarios
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Sujeto para el estado de autenticación
  private currentUserSubject = new BehaviorSubject<User | null>(null); // Sujeto para el usuario actual

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Observable para el estado de autenticación
  currentUser$ = this.currentUserSubject.asObservable(); // Observable para el usuario actual

  /**
   * Constructor que inyecta el cliente HTTP y el identificador de plataforma.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param platformId Identificador de plataforma para verificar si es un navegador.
   */
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    this.loadUserFromLocalStorage();
  }

  /**
   * Guarda el usuario actual en el almacenamiento local si está disponible.
   */
  private saveUserToLocalStorage(): void {
    if (this.isLocalStorageAvailable() && this.currentUserSubject.value) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUserSubject.value));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  /**
   * Carga el usuario actual desde el almacenamiento local si está disponible.
   */
  private loadUserFromLocalStorage(): void {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem('currentUser');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (user && isAuthenticated) {
        this.currentUserSubject.next(JSON.parse(user));
        this.isAuthenticatedSubject.next(isAuthenticated);
      }
    }
  }

  /**
   * Verifica si el almacenamiento local está disponible en el navegador.
   * @returns `true` si el almacenamiento local está disponible, `false` en caso contrario.
   */
  private isLocalStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  /**
   * Realiza el inicio de sesión verificando el nombre de usuario y la contraseña.
   * @param username Nombre de usuario.
   * @param password Contraseña.
   * @returns Observable que emite `true` si el inicio de sesión es exitoso, `false` en caso contrario.
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.get<{ usuarios: User[] }>(this.apiUrl).pipe(
      map(response => {
        const user = response.usuarios.find(u => u.username === username && u.password === password);
        if (user) {
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          this.saveUserToLocalStorage();
          return true;
        } else {
          return false;
        }
      })
    );
  }

  /**
   * Realiza el cierre de sesión del usuario actual.
   */
  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }

  /**
   * Verifica si un usuario está autenticado.
   * @returns `true` si el usuario está autenticado, `false` en caso contrario.
   */
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtiene el usuario actual.
   * @returns El usuario actual o `null` si no hay usuario autenticado.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario actual es un administrador.
   * @returns `true` si el usuario actual es un administrador, `false` en caso contrario.
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === 'admin';
  }

  /**
   * Actualiza el perfil del usuario actual.
   * @param updatedUser Usuario actualizado.
   */
  updateUserProfile(updatedUser: User): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const usuarios = this.getUsersFromLocalStorage();
      const userIndex = usuarios.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        usuarios[userIndex] = updatedUser;
        this.currentUserSubject.next(updatedUser);
        this.saveUsersToLocalStorage(usuarios);
        this.saveUserToLocalStorage();
      }
    }
  }

  /**
   * Añade un nuevo usuario.
   * @param newUser Nuevo usuario a añadir.
   */
  addUser(newUser: User): void {
    const usuarios = this.getUsersFromLocalStorage();
    newUser.id = usuarios.length + 1; // Asignar un nuevo ID
    usuarios.push(newUser);
    this.saveUsersToLocalStorage(usuarios);
  }

  /**
   * Obtiene los usuarios desde el almacenamiento local.
   * @returns Lista de usuarios.
   */
  private getUsersFromLocalStorage(): User[] {
    if (this.isLocalStorageAvailable()) {
      const usuariosJson = localStorage.getItem('usuarios');
      return usuariosJson ? JSON.parse(usuariosJson) : [];
    }
    return [];
  }

  /**
   * Guarda los usuarios en el almacenamiento local.
   * @param usuarios Lista de usuarios a guardar.
   */
  private saveUsersToLocalStorage(usuarios: User[]): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }

  /**
   * Obtiene todos los usuarios.
   * @returns Lista de todos los usuarios.
   */
  getAllUsers(): User[] {
    return this.getUsersFromLocalStorage();
  }
}
