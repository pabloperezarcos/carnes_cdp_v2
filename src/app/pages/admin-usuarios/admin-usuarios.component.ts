import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * Representa un usuario en el sistema.
 */
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
 * AdminUsuariosComponent gestiona la administración de usuarios, permitiendo agregar, editar y eliminar usuarios.
 * Incluye funcionalidades de filtrado y selección de usuarios.
 */
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
  passwordFieldType: string = 'password';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.http.get<{ usuarios: User[] }>('app/data/usuarios.json').subscribe(data => {
      this.authService.setUsuarios(data.usuarios);
      this.usuarios = this.authService.getAllUsers();
      this.filteredUsuarios = [...this.usuarios];
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
      this.filteredUsuarios = [...this.usuarios];
    }
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.isAdding = false;
  }

  saveUser(): void {
    if (this.isAdding) {
      this.authService.addUser(this.selectedUser!);
    } else {
      this.authService.updateUserProfile(this.selectedUser!);
    }
    this.usuarios = this.authService.getAllUsers();
    this.filteredUsuarios = [...this.usuarios];
    this.cancelEdit();
  }

  deleteUser(user: User): void {
    this.authService.deleteUser(user);
    this.usuarios = this.authService.getAllUsers();
    this.filteredUsuarios = [...this.usuarios];
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
      rol: 'cliente',
      imagen: ''
    };
    this.isAdding = true;
    this.isEditing = true;
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
