// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  address: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'app/data/usuarios.json'; // Ruta correcta al archivo JSON

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private isAuthenticated = false;
  private currentUser: User | null = null;

  private saveUserToLocalStorage(): void {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  private loadUserFromLocalStorage(): void {
    const user = localStorage.getItem('currentUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (user && isAuthenticated) {
      this.currentUser = JSON.parse(user);
      this.isAuthenticated = isAuthenticated;
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<{ usuarios: User[] }>(this.apiUrl).pipe(
      map(response => {
        const user = response.usuarios.find(u => u.username === username && u.password === password);
        if (user) {
          this.isAuthenticated = true;
          this.currentUser = user;
          this.saveUserToLocalStorage();
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
