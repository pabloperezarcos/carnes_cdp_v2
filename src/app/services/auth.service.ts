import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

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
  private apiUrl = 'app/data/usuarios.json';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private usuarios: User[] = [];

  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    this.loadUserFromLocalStorage();
  }

  private saveUserToLocalStorage(): void {
    if (this.isLocalStorageAvailable() && this.currentUserSubject.value) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUserSubject.value));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

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

  private isLocalStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

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

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === 'admin';
  }

  updateUserProfile(updatedUser: User): void {
    const userIndex = this.usuarios.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      this.usuarios[userIndex] = updatedUser;
      this.currentUserSubject.next(updatedUser);
      this.saveUsersToLocalStorage(this.usuarios);
      this.saveUserToLocalStorage();
    }
  }

  addUser(newUser: User): void {
    newUser.id = this.usuarios.length + 1;
    this.usuarios.push(newUser);
    this.saveUsersToLocalStorage(this.usuarios);
  }

  deleteUser(user: User): void {
    this.usuarios = this.usuarios.filter(u => u.id !== user.id);
    this.saveUsersToLocalStorage(this.usuarios);
  }

  setUsuarios(usuarios: User[]): void {
    this.usuarios = usuarios;
    this.saveUsersToLocalStorage(this.usuarios);
  }

  getAllUsers(): User[] {
    return this.usuarios;
  }

  private getUsersFromLocalStorage(): User[] {
    if (this.isLocalStorageAvailable()) {
      const usuariosJson = localStorage.getItem('usuarios');
      return usuariosJson ? JSON.parse(usuariosJson) : [];
    }
    return [];
  }

  private saveUsersToLocalStorage(usuarios: User[]): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }
}
