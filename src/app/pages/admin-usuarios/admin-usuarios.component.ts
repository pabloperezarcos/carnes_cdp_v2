// admin-usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  filteredUsuarios: User[] = [];
  selectedUser: User | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchQuery: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.http.get<{ usuarios: User[] }>('app/data/usuarios.json').subscribe(data => {
      this.usuarios = data.usuarios;
      this.filteredUsuarios = data.usuarios;
    });
  }

  filterUsuarios(): void {
    if (this.searchQuery) {
      this.filteredUsuarios = this.usuarios.filter(user =>
        user.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsuarios = this.usuarios;
    }
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.isAdding = false;
  }

  saveUser(): void {
    if (this.isAdding) {
      this.usuarios.push(this.selectedUser!);
    } else {
      const index = this.usuarios.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.usuarios[index] = this.selectedUser!;
      }
    }
    this.filteredUsuarios = this.usuarios;
    this.cancelEdit();
  }

  deleteUser(user: User): void {
    this.usuarios = this.usuarios.filter(u => u.id !== user.id);
    this.filteredUsuarios = this.usuarios;
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.isEditing = false;
    this.isAdding = false;
  }

  addUser(): void {
    this.selectedUser = {
      id: this.usuarios.length + 1,
      nombre: '',
      username: '',
      email: '',
      password: '',
      birthdate: '',
      address: '',
      rol: 'cliente'
    };
    this.isAdding = true;
    this.isEditing = true;
  }
}
